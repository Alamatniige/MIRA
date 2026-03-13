SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict TDNoq1MsI7evQJqnkFht85x5veqFfKaTDVvYz7XUWLwwDrcpSJ7rrpGwaaiXHiR

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '4d28debb-6318-4086-9d03-bdb78b1bc664', 'authenticated', 'authenticated', 'dimaandalrimvernon@gmail.com', '$2a$10$mCJ9SmMFFqZMZCrR/lAgpOzBRxlUMwokMwzCaRdLysFmqG4aRWlly', '2026-02-20 02:22:24.526019+00', '2026-02-20 02:22:07.619213+00', '', NULL, '', NULL, '', '', NULL, '2026-02-20 02:22:24.529885+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-02-20 02:22:07.603306+00', '2026-02-20 02:22:24.531877+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd6fbd73e-500b-4d2e-8a6a-fa6e28548a97', 'authenticated', 'authenticated', 'dimaandalrim@gmail.com', '$2a$10$9Bwz/Zhg4ZyeabIXt4kkBuZteTnx4eb967Si9FElPb8ZsbBYlU9Pa', '2026-03-05 05:15:36.172103+00', '2026-03-05 05:02:30.103048+00', '', NULL, '', NULL, '', '', NULL, '2026-03-05 05:15:36.177315+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-03-05 05:02:30.085575+00', '2026-03-05 05:15:36.181397+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '795ede9d-888f-4893-861e-809e782f50af', 'authenticated', 'authenticated', 'sapioruiz27@gmail.com', '$2a$10$/MVOOJphqAnvAP7k.qtcp.9sT64UlqFZfPbSnHPwve2WCsybqRklG', '2026-02-18 05:21:04.465851+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-03-06 02:48:38.074593+00', '{"provider": "email", "providers": ["email"]}', '{"full_name": "Ruiz Miguel Sapio", "email_verified": true}', NULL, '2026-02-18 05:21:04.444375+00', '2026-03-06 02:48:38.122976+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('795ede9d-888f-4893-861e-809e782f50af', '795ede9d-888f-4893-861e-809e782f50af', '{"sub": "795ede9d-888f-4893-861e-809e782f50af", "email": "sapioruiz27@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-02-18 05:21:04.456747+00', '2026-02-18 05:21:04.456811+00', '2026-02-18 05:21:04.456811+00', '4536d7c5-fd2e-4039-b45d-31d77dd6f208'),
	('4d28debb-6318-4086-9d03-bdb78b1bc664', '4d28debb-6318-4086-9d03-bdb78b1bc664', '{"sub": "4d28debb-6318-4086-9d03-bdb78b1bc664", "email": "dimaandalrimvernon@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-02-20 02:22:07.613213+00', '2026-02-20 02:22:07.613276+00', '2026-02-20 02:22:07.613276+00', '2e06eb9b-f4ec-430e-acf8-8849517d4d98'),
	('d6fbd73e-500b-4d2e-8a6a-fa6e28548a97', 'd6fbd73e-500b-4d2e-8a6a-fa6e28548a97', '{"sub": "d6fbd73e-500b-4d2e-8a6a-fa6e28548a97", "email": "dimaandalrim@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-03-05 05:02:30.095878+00', '2026-03-05 05:02:30.095929+00', '2026-03-05 05:02:30.095929+00', '6d15ff66-9fdd-41c9-81a7-45d4123b6171');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('ea9a28ff-1522-4c78-bb42-d5127571d073', '4d28debb-6318-4086-9d03-bdb78b1bc664', '2026-02-20 02:22:24.529973+00', '2026-02-20 02:22:24.529973+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '175.176.52.85', NULL, NULL, NULL, NULL, NULL),
	('7f95a041-dc9a-46d8-b73f-c5ca118d45b2', 'd6fbd73e-500b-4d2e-8a6a-fa6e28548a97', '2026-03-05 05:15:36.177399+00', '2026-03-05 05:15:36.177399+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36', '175.176.52.58', NULL, NULL, NULL, NULL, NULL),
	('0820cb4f-85cb-4357-bcf2-cec13437135e', '795ede9d-888f-4893-861e-809e782f50af', '2026-03-06 00:12:40.788611+00', '2026-03-06 00:12:40.788611+00', NULL, 'aal1', NULL, NULL, 'Go-http-client/2.0', '175.176.52.85', NULL, NULL, NULL, NULL, NULL),
	('16fd48f1-11c8-4033-952e-4674f48aee49', '795ede9d-888f-4893-861e-809e782f50af', '2026-03-06 00:48:44.617622+00', '2026-03-06 00:48:44.617622+00', NULL, 'aal1', NULL, NULL, 'Go-http-client/2.0', '175.176.52.85', NULL, NULL, NULL, NULL, NULL),
	('15ae227b-3f26-46f5-ab66-ad8561fb9d7e', '795ede9d-888f-4893-861e-809e782f50af', '2026-03-06 00:59:55.504944+00', '2026-03-06 00:59:55.504944+00', NULL, 'aal1', NULL, NULL, 'Go-http-client/2.0', '175.176.52.85', NULL, NULL, NULL, NULL, NULL),
	('fb759921-cf2f-479f-9e5b-18d7c4b00b13', '795ede9d-888f-4893-861e-809e782f50af', '2026-03-06 02:48:38.07486+00', '2026-03-06 02:48:38.07486+00', NULL, 'aal1', NULL, NULL, 'Go-http-client/2.0', '175.176.52.85', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ea9a28ff-1522-4c78-bb42-d5127571d073', '2026-02-20 02:22:24.532201+00', '2026-02-20 02:22:24.532201+00', 'otp', '6f422d66-a1af-4a49-b5b0-c35dc9a22cd0'),
	('7f95a041-dc9a-46d8-b73f-c5ca118d45b2', '2026-03-05 05:15:36.181872+00', '2026-03-05 05:15:36.181872+00', 'otp', '84177cc1-054a-4ead-a110-3e033550b184'),
	('0820cb4f-85cb-4357-bcf2-cec13437135e', '2026-03-06 00:12:40.86812+00', '2026-03-06 00:12:40.86812+00', 'password', 'd25c71a3-8d7c-4c51-abe9-dff03928f442'),
	('16fd48f1-11c8-4033-952e-4674f48aee49', '2026-03-06 00:48:44.661343+00', '2026-03-06 00:48:44.661343+00', 'password', '0eee8995-fac5-4b39-9439-87841cf921df'),
	('15ae227b-3f26-46f5-ab66-ad8561fb9d7e', '2026-03-06 00:59:55.53535+00', '2026-03-06 00:59:55.53535+00', 'password', 'fe03fca3-9c7c-43a0-a112-f5de3ec2e010'),
	('fb759921-cf2f-479f-9e5b-18d7c4b00b13', '2026-03-06 02:48:38.127999+00', '2026-03-06 02:48:38.127999+00', 'password', '41a87f92-38c2-4fd5-ad9a-35f1bb8f294a');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 14, 'ctclbte7uvar', '4d28debb-6318-4086-9d03-bdb78b1bc664', false, '2026-02-20 02:22:24.530904+00', '2026-02-20 02:22:24.530904+00', NULL, 'ea9a28ff-1522-4c78-bb42-d5127571d073'),
	('00000000-0000-0000-0000-000000000000', 68, 'di6srsstizcj', 'd6fbd73e-500b-4d2e-8a6a-fa6e28548a97', false, '2026-03-05 05:15:36.178646+00', '2026-03-05 05:15:36.178646+00', NULL, '7f95a041-dc9a-46d8-b73f-c5ca118d45b2'),
	('00000000-0000-0000-0000-000000000000', 76, 'ofuzepdiyoja', '795ede9d-888f-4893-861e-809e782f50af', false, '2026-03-06 00:12:40.82831+00', '2026-03-06 00:12:40.82831+00', NULL, '0820cb4f-85cb-4357-bcf2-cec13437135e'),
	('00000000-0000-0000-0000-000000000000', 77, 'ih7hyyvpnpo6', '795ede9d-888f-4893-861e-809e782f50af', false, '2026-03-06 00:48:44.643062+00', '2026-03-06 00:48:44.643062+00', NULL, '16fd48f1-11c8-4033-952e-4674f48aee49'),
	('00000000-0000-0000-0000-000000000000', 78, 'jdp2vrck2vwh', '795ede9d-888f-4893-861e-809e782f50af', false, '2026-03-06 00:59:55.525422+00', '2026-03-06 00:59:55.525422+00', NULL, '15ae227b-3f26-46f5-ab66-ad8561fb9d7e'),
	('00000000-0000-0000-0000-000000000000', 79, 'ztfjdrbad6hj', '795ede9d-888f-4893-861e-809e782f50af', false, '2026-03-06 02:48:38.09891+00', '2026-03-06 02:48:38.09891+00', NULL, 'fb759921-cf2f-479f-9e5b-18d7c4b00b13');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

INSERT INTO "drizzle"."__drizzle_migrations" ("id", "hash", "created_at") VALUES
	(1, 'f8529a0e0844549c23d50f311fe2a12aad657342f43a1f41a8216dbbb7312b19', 1771290738581),
	(2, '454fc4ca3e61b4db1e74931f08655d6c3d6e3b137d37a484e618fcf83828e9df', 1771292941397);


--
-- Data for Name: assetFloor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."assetFloor" ("id", "name", "created_at") VALUES
	(1, '3rd Floor', '2026-03-09 06:33:29+00'),
	(2, '4th Floor', '2026-03-10 04:34:46.284709+00');


--
-- Data for Name: assetRoom; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."assetRoom" ("id", "name", "created_at") VALUES
	(1, 'Developer', '2026-03-09 06:33:07+00'),
	(2, 'Project Management', '2026-03-10 04:34:45.834302+00');


--
-- Data for Name: assetStatusHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: assetType; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."assetType" ("id", "name", "created_at") VALUES
	(1, 'Laptop
', '2026-02-27 02:14:02.087411+00'),
	(2, 'Monitor', '2026-02-27 03:23:04.85353+00'),
	(3, 'Desktop', '2026-02-27 03:23:47.483645+00'),
	(4, 'Mouse', '2026-02-27 03:23:53.823779+00'),
	(5, 'Keyboard', '2026-02-27 03:24:01.00887+00');


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."assets" ("id", "assetName", "assetType", "serialNumber", "specification", "currentStatus", "createdAt", "isAssigned", "room", "floor", "tag", "image") VALUES
	('9b206d15-f4be-43e7-b680-f869d2ce4ded', 'Mac Book M3 Pro', 1, '0123-2345-5678-12GE', 'Metallic Gray', 'Brand New', '2026-02-27 05:34:21.339847', false, 1, 1, 'AS-02', NULL),
	('e9da18f8-e008-479d-9f5c-6afe5545fb86', 'Lenovo', 1, '0TY3-2345-5H48-12GE', 'Glossy Black', 'In Good Condition', '2026-02-27 03:31:05.80168', false, 1, 1, 'AS-03', NULL),
	('42b2763e-12b1-490a-b33f-983feb7e714f', 'ASUS', 4, '0123-2345-5678-13FF', 'Silver Gray', 'Active', '2026-03-10 14:07:27.751739', false, 2, 1, 'AS-06', NULL),
	('5f236ee4-d94b-4d90-bb3e-efc5294a9a7e', 'Lenovo ThinkPad', 1, '1092-3423-234J-2390', 'Black', 'Available', '2026-03-10 04:34:46.732863', false, 2, 2, 'AS-04', NULL),
	('9c625694-4085-4d20-80aa-ec8459353077', 'AOC Monitor', 2, 'J389-234H-ASD1-1349
', 'White', 'Available', '2026-03-10 04:39:36.880957', false, 1, 2, 'AS-05', NULL),
	('290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', 'Mac Book M4 Pro', 1, '0123-2345-5678-12GE', 'Metallic Gray', 'Brand New', '2026-02-27 03:39:50.251162', false, 1, 1, 'AS-01', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/e411635a-597b-4a4e-aaae-d94c58cf7cac.webp", "https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/d67c5092-403d-4b7d-8cea-ac7ddb5bd32c.jpg"]');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "roleName") VALUES
	(1, 'Admin'),
	(2, 'Staff');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "fullName", "password", "department", "createdAt", "roleId", "phoneNumber", "status", "lastActive", "assetCount", "assetsCount") VALUES
	('4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'admin@mira.com', 'Ruiz Miguel Sapio', '$2a$12$/a6xn3N1t9tUvCz4LS.kqOe56QPhDkE8AwBOl.c.MpFsiEVpemDAG', 'IT', '2026-03-09 05:46:11.392635', 1, '09000000000', 'active', NULL, NULL, 0),
	('37a8f454-8797-4aa9-b530-8c692c5695b4', 'sapioruiz23@gmail.com', 'Staff', '$2a$10$yaPjup9FbTdGeHSW6hc2JOOqtJ/QNdQeuPdZOH1es.6hP9PoucvWO', 'General', '2026-03-09 06:09:53.265658', 2, '+639927240717', 'active', NULL, NULL, 0);


--
-- Data for Name: assetsAssignment; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: asssetStatusHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: issueReports; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qrCodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."qrCodes" ("id", "assetId", "qrValue", "generateAt") VALUES
	('b69cf6fc-a3af-49c3-9ef9-364de0e587d8', 'e9da18f8-e008-479d-9f5c-6afe5545fb86', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB/0lEQVR42uyYPbLkIAyE20VAyBE4Cjfzz804CkcgdEDRWxL2W8/OizayXFYyNfaXyBJNS3jjjTf+LxaS3JGA2D2zI1cEecZnAQCmPWayAEhOfkI+XtgBHLntMbuKhRWOZWpBcIsAWyizr8mRNAsgNURqmux4IqA9qc24DG5rvzTt3QHVh5jPau4CfAvIzYERMSOUhTVxx/ybpN8cOFSOh0g3xNUxT/LvYUBafUmUAxZy8yRr6h/fwQIgHSj3kPRhlivJVfCapgWgIa2Qk6XFcjsEmIwBcDVJmqxxVV8QD21YHgXIldR9SeOfWjpHwhdbgDSj6oPKoBuWjntcTQEtsHstz7iStHzHEzMAGpJ4OVfjNnptYkVHfBjgmGfP3IBlFzx2BOLyHSwAIoM8vZy0p9Q3S5eaAhC4SlKhSJXU3YmYf+jD7QFRg02PU9QhwZcZSB0/+vAMYHGUYUHmhp8rSZ0rTAEi3SzJVXHckubET4NhAtA3OoxOml9cXcVVH0wAYx+F9mMP5EH/WrsZB85ZzwkXKONDA7q/Csj9gTNNnejGydJVz9+eNAGMHcjhqyXNTdP8ZwV6d+DcR8kop/uobbTc8kQAx6yHIYPfezkTQEIQF5SPal5dkAngWB5qT2rMrqZJZyFDwFgesoWy6HQQtzEdrI8C3njjjc/4EwAA///SU0hXYVZXDgAAAABJRU5ErkJggg==', '2026-02-27 03:31:07.508918'),
	('257aaf46-405c-4b86-a980-81253a3dfc4a', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtNa+AAACBklEQVR42uyYMY70KhCECxE45AgchZuNPTfjKByBkAC5nqrx03pGE/2RsdzS7mpnvqTtoqhuPPXUU/9WK0k2gCwAkv7rQb95LwCAa0i+wrEmIG4I+fhiHsCT7xYzQnnBunU9ZLLMCLCHom4BvDAtkE1lFd4kd0PANBmzr3oA7EvBL9FeHTB/iLmH8lpq8i2+fxnIxYFR42QtNdnJ+mHpFwckOXn1sDd1vOuPOfedANa0yf9q3BfmvpSV/NTkFID8Acm6Ddk33Uwguc0G7Avp9VGguRySO7ncDMAByR9W9dfipqzTvvPc5MAqF190HUW9VAxNnh/UDADIvOpKYnHUS5UNpl1uMRMAJGkSUJvAwreuo4WTAYFvFpjkzN7gK3ZE3gwYz6Ej7kDqi2U5SXMmQCdrZUkWfapOlswcf5qcAjhunyR/GHeRyp2y3BSAr2mMcso6avNlkvurWwCrr0litJeqIaisPdC109w9A6AfjQ/HyYItEdwpBU0BeOaXmZ3Gh6FJAzgb4IZXY0wHupJOXn0P4Jj1FBxgno61A/uH218fOJaHiRXOxoc4diAf48P1gbEDIcLIcg1utImpgGPtZonU9lFDct8r0JsAyg8tcOSH9HP9eH0gWzCtkCaPYDoVcGzdBdj4YGtrfIv26sBYHv5/sjQLyR9a3G4FPPXUU5/1XwAAAP//df7GO1Av6jAAAAAASUVORK5CYII=', '2026-02-27 03:39:51.593754'),
	('6be7dfd5-8de7-4f3b-9e86-254015fe4698', '9b206d15-f4be-43e7-b680-f869d2ce4ded', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB+ElEQVR42uyZsXHlMAxEV8OAIUtgKexMlDpjKSyBIQOO9gagbOt/31xw0YdGCO3nAAKwWNB44okn/i8ySfZYRuDhWRzrMoL8jPcCACw9FkceviX2uI9Qzl/YARy590ggHgAcyREKWQ0CgGtYfUuzWEaBKD22kwW+AncEtCcBNhmyMrxW81fTfjrwrQ9Vq6mT9XcB+WDgJ+LOlv4l6x8MZGhShQ0rpErC4fAXrb4DoKG7SGMAq2vpQNwsATJOC2tyTfODp2j64Wu2BIDkJtKmiSXXkbVYFbaAJvZAFuveVd4wO2+7FZCBJB9AvByQOL8DPE0B4nv2OVV7V6nYXEu4VNMEMJPiQDzmShLgqnImAMcivnpIywGuY3Us7HG7FZCn50kKBBHz9yPIBOBYsi7WSAF8lT+hKoYlYHbgWazxtaR+BMQEACTRB5WJlsRXy6xdvdwtgLl5E8IpfPFwDezGAIR5yk1Hyh4PR+LVshoANLepcgqcls4WMJDkOkCoK5C+j7ufYt0COBuRp5g71jzwYlktAF93t95wslF1SfEigyaA8/FwBG4IKnZvaZoA5ntUcfMlR0Zqtly+KwDfkrSnCkg1CABDND2U4esygFebZACYj4fJUbtQ5O33Svp8YOqDVCjLKadvumXp7//oMQ488cQTr/EnAAD//6+rqQ9lUqs7AAAAAElFTkSuQmCC', '2026-02-27 05:34:22.382109'),
	('01f92553-4d6a-4da3-b5e5-b70db8f7f52c', '5f236ee4-d94b-4d90-bb3e-efc5294a9a7e', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB+0lEQVR42uyYMZKkMAxFP+WA0EfwUbhZAzfjKD6CQwcu/taX6VqY7U0malEomXHzElnStyQ89thjv7OZJCsQmHVsI9mifuO9AABDxdT6H4x5aHE7PvgBArnWtAXm2bzljriR2SNAxGxuAnLTKbD1PNv+fw/OAcvJpJ9esNQEPiTttwOmD3Izv8YyhZrWTwLy5UC3pONrLCDz0D5I+pcDSjkewiCdBmZzM98MYJl2u4e0WElxD7zmpA8AM/P01oealqCgcvEGSBgQudbIQC6hTMO59BwAYJlWZpWUVVZN8k9JeCtgDnYPYElr74IkjMP5zfIANEw8GgcWhO7fOSc9AArWMuZJKm5uclU+jr6A2aorQ5VFkzeEgq57NwIUOB3D0QXZELRhpCtg1vRDRZM8ovmjf/ABxN4X6Ekq6hL070UfHABolmv6eAykUoz95OctAHN3tJIyGWR+BW5DvcwXLoC5bw9eiGxIK8t0VnsfQKTEvNn4IE2Xyp3bJBdAP26Hm6xpPXTvVsAx620saXkPQcA+/hUQD8B7eaiptUaND7RVz2l88AD0HYgwRSlUDD/cdAG8l4dFwqAnqafcZXtwH6BHkxjzYDL4zz24ACyavX8gt+G6JPl+oG/d0exl0hu7I/oD+vKQlnJ6hyzzdqTlVsBjjz12tT8BAAD//yDHuhWrdSYsAAAAAElFTkSuQmCC', '2026-03-10 04:34:47.152877'),
	('b9002c2f-e4de-4ae1-b2f1-b35c922a132f', '9c625694-4085-4d20-80aa-ec8459353077', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAABnUlEQVR42uyYvbHkIBCEm5IhUyEoFEKD0AhlQ5Apg6KvekC7eq9u3atjSuMt+tYZ5qcbPPHEE/9tbFScQGJdD0SG833kCXgBWE7EDKzHXhDO68gXENkMYAV28nPkEQB0wztzcw28r9srYCW8FQArWcC/l/3sQB9IW0mhKg/pyxCbHLgiMtA+fds8cwPbC8k+qar5iuy1PR0Qc8N6IGHRJWaS/T++ABbYCKIVLce81XbxBGhVNnHZ2lEDV5P21psugI3MTZM2ad72Scvyc9J6ALQktUpyW3o9C0jt3rwOAKB3alcEVtUCwn2hOADsV11JAUpK4LFrLsMVgJEBpIs+sVuJewNMzUZa8zLbPae7CvIASMAGE3vqV/ObSo03wGRefYu9opzo7hdfwNiiw6HYD4uKmYCLK4nVrtZEAsNvAzI58DFV40x2MuZQ4QsYrnlIvtLzkO/6wQfweQOxhdKLOlSXgDTtsCvmzX44NT9Az4OEAXng25PXzMB4vkptoflNHurk3807OzBetGzJiG5mrr0BTzzxxD+PPwEAAP//QNfV+sT+AKwAAAAASUVORK5CYII=', '2026-03-10 04:39:37.298698'),
	('fd0b9cc0-c8eb-44db-9f0b-2982c0ec547d', '42b2763e-12b1-490a-b33f-983feb7e714f', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAACAklEQVR42uyZMZLkIAxFv4uAkCNwFG7Wtm/GUTiCQgLKf0vCs+PemWijlsuKXMNLGKH/JTWeeOKJ/4uVJHsmJbMDoeOFpH/jvQAASwco+YhSBrCMVM8DP0Ag944yUtMbIzYgVbI5BHINgoWsQObwC+h3FIy7AvYmc6XkvScGWjZ/PNpPB6Y+1JHaK0oJPe/jNwH5bGBGJtleVlLcxy+S/uHACpSd1Ee29FRVH4Je/JrNGwA4b33KYOiZAwXImydgHSi7OqqouZbA9goCdwASj0htD3aKJWokHsj0BAB2zRLILQoQuWmB9ZsB9n9ArppGoGhJUcpCbp4AULBOY12tI9XKgjdAK0u/tSHQLiiaHbFnV4Cq3MqmwMsOtT3gcfGkWwBrEOiJTj5nNinF+m9HAChmrEhmrDrKBYHd1hGwjlPMOY2V3IKUq9q7AKa0WT/Xp8r961k3AaAqbk9ThyDL5nJRGA8Agr1JDuQtsppaWDZ9AUjcYsMpb9peq7Fe+wcHwDpSXaaxLlZZbTFLAm4F/J31JLMnqvMO4LiIuQfga+5G4q7jQ7e12/FjR/rhwLk8nFPo3OQA7xOrA+B7HzVVLqtaXLX6RgAKUnvNTmhm81vtPQFfazdL7NubdAHMN1lOeUO0hdVVBl0A5y8gA1lbuhHNkq6VdQvgiSeeeI8/AQAA///C6oYkZqP6mgAAAABJRU5ErkJggg==', '2026-03-10 14:07:29.057595');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('asset', 'asset', NULL, '2026-03-11 04:40:23.664987+00', '2026-03-11 04:40:23.664987+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('9bd523f9-c204-4b6d-9c83-4d11e50b57e5', 'asset', 'ae2d71b6-5d8b-428e-9b9a-564f5010efbd.jpg', NULL, '2026-03-11 05:35:57.643821+00', '2026-03-11 05:35:57.643821+00', '2026-03-11 05:35:57.643821+00', '{"eTag": "\"aa24f48c9209c5eb05cbca793472235f\"", "size": 141162, "mimetype": "text/plain;charset=UTF-8", "cacheControl": "3600", "lastModified": "2026-03-11T05:35:58.000Z", "contentLength": 141162, "httpStatusCode": 200}', '786246c0-cfb3-46ab-b5da-f5e4ead74ae9', NULL, '{}'),
	('1e8b1332-09b3-42eb-8732-72ac39838ea4', 'asset', 'e411635a-597b-4a4e-aaae-d94c58cf7cac.webp', NULL, '2026-03-11 06:01:04.569075+00', '2026-03-11 06:01:04.569075+00', '2026-03-11 06:01:04.569075+00', '{"eTag": "\"30afa29875941ef9cc3e302ffc52a754\"", "size": 3722, "mimetype": "text/plain;charset=UTF-8", "cacheControl": "3600", "lastModified": "2026-03-11T06:01:05.000Z", "contentLength": 3722, "httpStatusCode": 200}', 'b296a073-226d-46df-b137-48815c99e140', NULL, '{}'),
	('c1bf2583-3c49-47fe-93ad-e977b4390645', 'asset', 'd67c5092-403d-4b7d-8cea-ac7ddb5bd32c.jpg', NULL, '2026-03-11 06:01:05.766328+00', '2026-03-11 06:01:05.766328+00', '2026-03-11 06:01:05.766328+00', '{"eTag": "\"aa24f48c9209c5eb05cbca793472235f\"", "size": 141162, "mimetype": "text/plain;charset=UTF-8", "cacheControl": "3600", "lastModified": "2026-03-11T06:01:06.000Z", "contentLength": 141162, "httpStatusCode": 200}', '317a7889-d8c4-4ac6-823a-2f3a9a79d0db', NULL, '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 79, true);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('"drizzle"."__drizzle_migrations_id_seq"', 2, true);


--
-- Name: assetFloor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."assetFloor_id_seq"', 2, true);


--
-- Name: assetRoom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."assetRoom_id_seq"', 2, true);


--
-- Name: assetType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."assetType_id_seq"', 7, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."roles_id_seq"', 2, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict TDNoq1MsI7evQJqnkFht85x5veqFfKaTDVvYz7XUWLwwDrcpSJ7rrpGwaaiXHiR

RESET ALL;
