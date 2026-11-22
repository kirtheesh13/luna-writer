import io
import sys
from fastapi.testclient import TestClient
from backend.app.main import app

def run_tests():
    print("=" * 60)
    print("Starting Comprehensive Test Suite for Luna Writer & Masterclass")
    print("=" * 60)

    with TestClient(app) as client:
        # 1. Health check
        print("\n--- Test 1: Health Check ---")
        res = client.get("/api/health")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        data = res.json()
        print(f"Health Status: {data['status']}, Database Mode: {data['database']}, Gemini: {data['gemini_ai']}")

        # 2. Category endpoints: stories, articles, letters, emails
        print("\n--- Test 2: Category Listings (All 4 formats) ---")
        for cat in ["stories", "articles", "letters", "emails"]:
            res = client.get(f"/api/writings?category={cat}")
            assert res.status_code == 200
            data = res.json()
            items = data["items"]
            print(f"  Category '{cat}': {len(items)} published pieces (Total: {data['total']})")
            assert len(items) > 0, f"Expected sample pieces in {cat}"
            first = items[0]
            print(f"    Sample: '{first['title']}' | CEFR: {first['level']} | Reading time: {first['reading_time_minutes']} min")

        # 3. Individual Writing Retrieval
        print("\n--- Test 3: Individual Writing Retrieval ---")
        sample_id = items[0]["id"]
        res = client.get(f"/api/writings/{sample_id}")
        assert res.status_code == 200
        writing_item = res.json()
        print(f"  Retrieved: '{writing_item['title']}' ({writing_item['word_count']} words)")
        assert writing_item["id"] == sample_id

        # 4. Authentication Flow (Register, Login, Protected Profile)
        print("\n--- Test 4: Authentication Flow ---")
        test_email = "aspiring_author@example.com"
        test_password = "SecretPassword123!"
        test_name = "Aspiring Author"

        # Register
        reg_res = client.post("/api/auth/register", json={
            "email": test_email,
            "password": test_password,
            "full_name": test_name
        })
        if reg_res.status_code == 400 and "already exists" in reg_res.text:
            print("  Test user already exists, proceeding to login...")
            login_res = client.post("/api/auth/login", json={
                "email": test_email,
                "password": test_password
            })
            assert login_res.status_code == 200
            auth_token = login_res.json()["access_token"]
        else:
            assert reg_res.status_code == 200, f"Registration failed: {reg_res.text}"
            auth_token = reg_res.json()["access_token"]
            print(f"  User registered successfully: {reg_res.json()['user']['email']}")

        auth_headers = {"Authorization": f"Bearer {auth_token}"}

        # Check /api/auth/me
        me_res = client.get("/api/auth/me", headers=auth_headers)
        assert me_res.status_code == 200
        print(f"  Authenticated profile: {me_res.json()['full_name']} ({me_res.json()['email']})")

        # 5. Writing Studio: Create Draft, Auto-Save, and Private Vault
        print("\n--- Test 5: Writing Studio (Draft & Auto-Save) ---")
        new_draft = {
            "title": "A Walk Through the Autumn Forest",
            "category": "stories",
            "topic": "Nature",
            "level": "B1",
            "status": "draft",
            "visibility": "private",
            "content": "Golden leaves carpeted the winding trail as the morning fog began to lift. A distant crow called out from the canopy of ancient oak trees, breaking the profound silence.",
            "description": "A sensory draft about exploring a peaceful autumn forest.",
            "tags": ["Nature", "Forest", "Autumn"]
        }
        create_res = client.post("/api/writings", json=new_draft, headers=auth_headers)
        assert create_res.status_code == 200, f"Draft creation failed: {create_res.text}"
        draft_item = create_res.json()
        draft_id = draft_item["id"]
        print(f"  Draft created with ID: {draft_id} (Word count: {draft_item['word_count']})")

        # Update draft (auto-save simulation)
        update_res = client.put(f"/api/writings/{draft_id}", json={
            "content": new_draft["content"] + " The gentle breeze carried the earthy scent of pine needles and damp moss."
        }, headers=auth_headers)
        assert update_res.status_code == 200
        print(f"  Draft updated (New word count: {update_res.json()['word_count']})")

        # Check private vault
        my_res = client.get("/api/writings/user/mine", headers=auth_headers)
        assert my_res.status_code == 200
        my_drafts = [d for d in my_res.json()["items"] if d["id"] == draft_id]
        assert len(my_drafts) == 1, "Draft must be present in user's private vault"
        print("  Draft successfully confirmed in private vault.")

        # 6. AI Publishing Gate (< A1 flash message test & >= A1 approval test)
        print("\n--- Test 6: AI Publishing Gate ---")
        
        # 6a. Under-developed writing (< A1)
        too_short_eval = client.post("/api/evaluate/writing", json={
            "title": "Bad draft",
            "content": "cat dog run.",
            "category": "stories"
        })
        assert too_short_eval.status_code == 200
        eval_short = too_short_eval.json()
        print(f"  Short writing result: can_publish={eval_short['can_publish']}, level={eval_short['cefr_level']}")
        assert eval_short["can_publish"] is False, "Under-developed draft must NOT be eligible to publish"
        assert "Sorry, your writing is not up to the mark yet" in eval_short["verdict_message"], "Must match exact user requested message"
        print(f"  Confirmed exact flash message: \"{eval_short['verdict_message']}\"")

        # 6b. Well-developed writing (>= A1)
        good_text = (
            "During my summer vacation in the coastal village of Portree, I spent every morning observing the fishing boats. "
            "The fishermen departed before sunrise, their weathered wooden vessels cutting through the icy waves with determined precision. "
            "In the afternoons, seagulls wheeled overhead, crying out in anticipation as the boats returned with silver catches of mackerel. "
            "I sketched the harbour lighthouse in my leather journal, reflecting on how simple routines create profound peace."
        )
        good_eval = client.post("/api/evaluate/writing", json={
            "title": "Portree Harbours",
            "content": good_text,
            "category": "stories"
        })
        assert good_eval.status_code == 200
        eval_good = good_eval.json()
        print(f"  Good writing result: can_publish={eval_good['can_publish']}, level={eval_good['cefr_level']}, score={eval_good['score']}/100")
        assert eval_good["can_publish"] is True, "Well-developed writing must be eligible to publish"
        print(f"  Publish eligibility confirmed with CEFR {eval_good['cefr_level']}!")

        # 7. Reader Actions: AI Review Highlights & Finished Reading
        print("\n--- Test 7: Reader Actions ---")
        # 7a. AI Review Highlights
        hl_res = client.post("/api/evaluate/reading-highlights", json={
            "title": writing_item["title"],
            "content": writing_item["content"],
            "category": writing_item["category"]
        })
        assert hl_res.status_code == 200
        hl_data = hl_res.json()
        print(f"  AI Highlights generated: {len(hl_data['highlights'])} key highlights, {len(hl_data['learning_takeaways'])} takeaways")

        # 7b. Finished Reading
        finish_res = client.post("/api/reading/finish", json={
            "writing_id": sample_id,
            "writing_title": writing_item["title"],
            "category": writing_item["category"],
            "word_count": writing_item["word_count"]
        }, headers=auth_headers)
        assert finish_res.status_code == 200
        print(f"  Finished reading logged: \"{finish_res.json()['message']}\"")

        # Check Achievements
        achieve_res = client.get("/api/reading/achievements", headers=auth_headers)
        assert achieve_res.status_code == 200
        achieve_data = achieve_res.json()
        print(f"  Achievements: Today's Reads={achieve_data['today_count']}, Weekly Total={achieve_data['weekly_total']}, Streak={achieve_data['streak_days']} day(s)")
        assert achieve_data["today_count"] >= 1
        assert achieve_data["total_completed"] >= 1

        # 8. Vocabulary Vault
        print("\n--- Test 8: Vocabulary Vault ---")
        add_vocab = client.post("/api/vocabulary", json={
            "word": "invigorating",
            "definition": "Making one feel strong, healthy, and full of energy.",
            "example_sentence": "The fresh coastal air was invigorating.",
            "source_title": writing_item["title"]
        }, headers=auth_headers)
        assert add_vocab.status_code == 200
        vocab_item = add_vocab.json()
        print(f"  Vocabulary word added: '{vocab_item['word']}'")

        get_vocab = client.get("/api/vocabulary", headers=auth_headers)
        assert get_vocab.status_code == 200
        assert any(v["word"] == "invigorating" for v in get_vocab.json())
        print(f"  Vocabulary Vault confirmed ({len(get_vocab.json())} words saved).")

        # 9. Document Upload Dropzone Test
        print("\n--- Test 9: Document Upload Dropzone ---")
        mock_file_content = b"# A Study in Amber\n\nRain poured over the cobblestone streets as the detective examined the mysterious antique watch."
        upload_res = client.post(
            "/api/upload",
            files={"file": ("study_in_amber.md", io.BytesIO(mock_file_content), "text/markdown")}
        )
        assert upload_res.status_code == 200
        up_data = upload_res.json()
        print(f"  File uploaded and parsed: Title='{up_data['title']}', Words={up_data['word_count']}")
        assert "cobblestone" in up_data["content"]

        # Clean up test draft
        client.delete(f"/api/writings/{draft_id}", headers=auth_headers)
        print("  Test draft cleaned up successfully.")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
