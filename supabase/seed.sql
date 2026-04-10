SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict zHMQvRu325PpYaDlndxHd48UEAlDCcEtzcCiImIeqYneb8k3V4Omp2teXCbZrC7

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
-- Data for Name: assetFloor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."assetFloor" ("id", "name", "created_at", "level") VALUES
	(5, '5th Floor', '2026-03-17 02:32:45.755507+00', 5),
	(4, '4th Floor', '2026-03-17 02:32:31.39431+00', 4),
	(2, '2nd Floor', '2026-03-10 04:34:46.284709+00', 2),
	(1, 'Ground Floor', '2026-03-09 06:33:29+00', 1),
	(3, '3rd Floor', '2026-03-17 02:32:19.943595+00', 3);


--
-- Data for Name: assetRoom; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."assetRoom" ("id", "name", "created_at", "floorId", "x", "y", "width", "height") VALUES
	(5, 'Head Office', '2026-03-17 02:38:10.54801+00', 5, 20, 20, 100, 80),
	(6, 'Meeting Room', '2026-03-17 02:38:23.47377+00', 5, 140, 20, 100, 80),
	(2, 'PM Room', '2026-03-10 04:34:45.834302+00', 4, 20, 20, 100, 80),
	(4, 'QA Room', '2026-03-17 02:38:00.182948+00', 4, 140, 20, 100, 80),
	(3, 'Server Room', '2026-03-17 02:33:10.211868+00', 3, 20, 20, 100, 80),
	(1, 'Developer Room', '2026-03-09 06:33:07+00', 4, 260, 20, 100, 80);


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

INSERT INTO "public"."assets" ("id", "assetName", "assetType", "serialNumber", "specification", "currentStatus", "createdAt", "isAssigned", "room", "floor", "tag", "image", "assignmentStatus") VALUES
	('ea61acb2-26c9-4ee4-90a9-c6c8a92589ba', 'Attack Shark X11', 4, '1233-1233-1233-1233', 'White', 'Good', '2026-03-16 00:05:08.36615', true, 1, 4, 'AS-06', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/76db7a5d-5007-41aa-908c-f75e8f4f24f7.webp", "https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/ddf74362-0d69-4e40-a242-ad6da870315f.webp", "https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/2610e6d3-6c44-444d-aa89-4c422e4c1460.jpg"]', 'Unavailable'),
	('0b3ae9bd-104d-4875-9753-d8bdd27ecc95', 'Asus', 3, 'SN - 013024', 'Intel Core i5-10400F', 'Good', '2026-04-06 12:33:35.60925', false, 3, 3, 'AS-13', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/73d6ffb0-4711-4fb6-8623-735da14762d7.webp"]', 'Available'),
	('65ba725c-d900-4482-b0a6-49689e378007', 'MSI Thin A15', 1, '1234-1234-1234-1234', 'Metalic Gray', 'Good', '2026-03-16 01:24:58.514213', true, 1, 4, 'AS-07', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/43e15f33-0fed-4e4e-9e8b-c025481804eb.webp", "https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/7f53586e-19aa-4e74-95d7-cfc1cca482d6.webp"]', 'Unavailable'),
	('9b206d15-f4be-43e7-b680-f869d2ce4ded', 'Mac Book M3', 1, '0123-2345-5678-12GE', 'Metallic Gray', 'Good', '2026-02-27 05:34:21.339847', false, 4, 2, 'AS-02', '[]', 'Available'),
	('9c625694-4085-4d20-80aa-ec8459353077', 'AOC Monitor', 2, 'J389-234H-ASD1-1349
', 'Black', 'Good', '2026-03-10 04:39:36.880957', false, 2, 4, 'AS-05', '[]', 'Available'),
	('5f236ee4-d94b-4d90-bb3e-efc5294a9a7e', 'Lenovo ThinkPad', 1, '1092-3423-234J-2390', 'Black', 'Good', '2026-03-10 04:34:46.732863', false, 1, 2, 'AS-04', '[]', 'Available'),
	('e9da18f8-e008-479d-9f5c-6afe5545fb86', 'Lenovo Ideapad', 1, '0TY3-2345-5H48-12GE', 'Glossy Black', 'Good', '2026-02-27 03:31:05.80168', true, 1, 2, 'AS-03', '[]', 'Unavailable'),
	('290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', 'Mac Book M4 Pro', 1, '0123-2345-5678-12GE', 'Metallic Gray', 'Good', '2026-02-27 03:39:50.251162', true, 2, 2, 'AS-01', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/e411635a-597b-4a4e-aaae-d94c58cf7cac.webp", "https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/d67c5092-403d-4b7d-8cea-ac7ddb5bd32c.jpg"]', 'Pending'),
	('f21342d4-e9a4-43db-88d7-7ce1d1551d79', 'Logitech', 4, 'SN-032143', 'Black', 'Good', '2026-04-06 12:17:08.044016', false, 6, 5, 'AS-08', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/985e2d17-6594-4836-a4f8-7ef415300963.jfif"]', 'Available'),
	('17fdb135-ab0c-487b-b31e-94aeea827a3e', 'HP Series 3 Pro', 2, 'SN - 412890', '23.8 inch', 'Good', '2026-04-06 12:24:44.536178', false, 3, 3, 'AS-11', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/915082d6-49aa-428f-80db-823ca097d1bd.png"]', 'Available'),
	('0e8dd72c-bc7a-4cb7-9c9d-58d6d4bd1929', 'HP', 3, 'SN - 413678', '27 inch monitor', 'Good', '2026-04-06 12:30:28.513714', false, 1, 4, 'AS-12', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/55876417-c561-48d5-80f0-49fb0905882c.avif"]', 'Available'),
	('8200d6d6-6c03-4a8e-be1c-9aad180e0400', 'Razer', 5, 'SN - 572016', 'White', 'Good', '2026-04-06 12:22:35.487267', true, 4, 4, 'AS-10', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/b58044d9-af9f-45e5-bbf4-09ef75c20d13.webp"]', 'Unavailable'),
	('aabd45ba-26db-49f4-9dd6-bdd35700f495', 'Logitech', 5, 'SN - 427861', 'Black', 'Good', '2026-04-06 12:19:24.059493', true, 5, 5, 'AS-09', '["https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/asset/8a12e958-b81b-4a3d-9159-c3d745984aae.jfif"]', 'Unavailable');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "roleName", "permittedPages") VALUES
	(2, 'Staff', '[]'),
	(1, 'Admin', '["Dashboard", "Assets", "Assignments", "Reports", "Users"]'),
	(3, 'Asset Manager', '["Assets"]');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "fullName", "password", "department", "createdAt", "roleId", "phoneNumber", "status", "lastActive", "assetsCount", "avatarUrl") VALUES
	('0b84b3d5-7a19-4749-a4f7-ece889fb9653', 'sapioruiz27@gmail.com', 'Rupert Dimagiba', '$2a$10$/DqbLYi6lUxL9rKwvvrfSOycJeltAOJSsRdc4/V9UDIgVVWM4iTlK', 'Head Office', '2026-04-01 05:29:54.055852', 1, '123123123123', 'active', '2026-04-09 10:32:51.304595+00', NULL, 'https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/avatar/0b84b3d5-7a19-4749-a4f7-ece889fb9653/02bbb378-ed02-4218-b782-41fed8c59e8e.jpg'),
	('515d239f-b702-478c-9a96-8504d1feedf0', 'dimaandalrim@gmail.com', 'Rim Vernon Dimaandal', '$2a$10$FCzx8GVdOZU1Jt/lXdiidOo9EVIQsT8qZ/sySFk5AJ3SNfYT1zO1S', 'IT', '2026-03-16 01:30:26.918941', 3, '123123123', 'active', '2026-04-08 02:43:27.216147+00', 0, NULL),
	('37a8f454-8797-4aa9-b530-8c692c5695b4', 'sapioruiz23@gmail.com', 'John Doe', '$2a$10$PL.Bv3aFPv6Qkwf2IATF7u5dpmmyh62excrVjEGHsm0F5NnHBC9du', 'Project Management', '2026-03-09 06:09:53.265658', 2, '+639927240717', 'active', '2026-04-10 00:25:20.303292+00', 3, 'https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/avatar/37a8f454-8797-4aa9-b530-8c692c5695b4/388f85c8-f98e-4451-b65f-3c84bf0a7f32.jpg'),
	('dffb7e87-412c-42f8-a505-85ad81c6b07e', 'rimvernondimaandal011@gmail.com', 'Rim Vernon M. Dimaandal', '$2a$10$nwbYw/0H1RnDm.rYwlBtKen0kcCpnuCsL6XIiIHqlH4dKflxZKn4.', 'Head Office', '2026-03-24 15:13:12.175907', 2, '123123123123', 'active', '2026-04-10 00:18:51.488785+00', NULL, 'https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/avatar/dffb7e87-412c-42f8-a505-85ad81c6b07e/0645394a-a1ac-4248-b334-d6647bd8f722.jpg'),
	('4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'admin@mira.com', 'Ruiz Miguel Sapio', '$2a$12$/a6xn3N1t9tUvCz4LS.kqOe56QPhDkE8AwBOl.c.MpFsiEVpemDAG', 'IT', '2026-03-09 05:46:11.392635', 1, '09000000000', 'active', '2026-04-10 00:29:21.990714+00', 0, 'https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/avatar/4d78e3c2-8361-4a0e-8360-a717e2ed6d76/03fa0534-f11a-4502-ac24-6adae6e52edf.JPG');


--
-- Data for Name: assetsAssignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."assetsAssignment" ("id", "userId", "assignedDate", "returnedDate", "acknowledged", "assetId", "notes", "issuedByUserId", "issuedByNameSnapshot", "rejectedAt", "rejectedByUserId", "rejectionReason", "confirmedAt") VALUES
	('8ee21dcc-6364-4017-87bc-37997091679c', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-15 15:42:22.962192', NULL, false, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', '', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', '2026-03-16 05:57:45.929425', '515d239f-b702-478c-9a96-8504d1feedf0', 'Not Valid', NULL),
	('1acfedce-ed11-4df6-8a20-fec51d7ffc98', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-24 01:54:20.606845', '2026-03-24 05:27:13.283281', true, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', '', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', NULL, NULL, '', NULL),
	('0d6c7ddd-9ff1-49b2-a0f0-862c642d1bc4', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-15 16:11:26.355268', '2026-03-24 05:27:53.635675', true, 'e9da18f8-e008-479d-9f5c-6afe5545fb86', '', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', NULL, NULL, NULL, NULL),
	('18786d28-dd46-4d9a-9ba9-2e53ce0c92af', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-24 07:03:36.242738', NULL, false, 'ea61acb2-26c9-4ee4-90a9-c6c8a92589ba', '', '37a8f454-8797-4aa9-b530-8c692c5695b4', '', '2026-03-24 07:07:24.006779', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'No', NULL),
	('dd3fa1b6-39b1-4986-8ea7-0527eb8c8bb6', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-15 15:59:09.915662', '2026-03-26 01:23:08.823913', true, '9b206d15-f4be-43e7-b680-f869d2ce4ded', '', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', NULL, NULL, NULL, NULL),
	('4a169ff8-d073-4cdb-96fc-2c47d7ee35c9', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-26 00:42:13.382099', NULL, false, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', '', '37a8f454-8797-4aa9-b530-8c692c5695b4', '', '2026-03-26 01:24:22.609454', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'no', NULL),
	('0956d911-5248-4649-8907-e9e8d6f5a319', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-24 07:09:13.093786', NULL, false, 'ea61acb2-26c9-4ee4-90a9-c6c8a92589ba', 'Test', '37a8f454-8797-4aa9-b530-8c692c5695b4', '', '2026-03-26 01:24:28.707862', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'No', NULL),
	('8874fb9c-b2ff-48e4-8b8c-a39895c70341', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-26 13:21:27.909779', NULL, false, '9b206d15-f4be-43e7-b680-f869d2ce4ded', '', '37a8f454-8797-4aa9-b530-8c692c5695b4', '', '2026-03-26 23:55:29.450169', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'NO', NULL),
	('86a7c109-051c-4fb2-ba89-d1c4069e425a', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-26 01:35:01.80253', NULL, false, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', 'pahiram', '37a8f454-8797-4aa9-b530-8c692c5695b4', '', '2026-03-26 23:55:38.796863', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'NOOOOOOOOOO', NULL),
	('c66b0761-cd91-4d8e-a473-b42f64b69415', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '2026-03-27 03:00:06.443843', NULL, true, 'ea61acb2-26c9-4ee4-90a9-c6c8a92589ba', '', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', NULL, NULL, '', '2026-03-27 03:02:07.539228'),
	('8e1216f5-1f1e-4889-b813-d42ded39461b', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '2026-03-27 03:41:09.889253', NULL, true, 'e9da18f8-e008-479d-9f5c-6afe5545fb86', 'Wow ganda pahiram', '515d239f-b702-478c-9a96-8504d1feedf0', 'Rim Vernon Dimaandal', NULL, NULL, '', '2026-03-27 03:46:45.104683'),
	('b53ba0db-bfa9-4640-8ccb-6342bd1ab313', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-27 00:35:16.819408', NULL, false, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', 'Pahiram po plzzz', '37a8f454-8797-4aa9-b530-8c692c5695b4', '', '2026-04-01 02:26:50.01371', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Pass', NULL),
	('2cc3f6ed-8d7a-41c1-93fb-6b9f9b7d4c08', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-06 02:16:12.753684', '2026-04-06 02:26:12.533653', true, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', '', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', NULL, NULL, '', '2026-04-06 02:17:02.410125'),
	('75a7b383-c9f5-433a-be34-e5864a5f14a6', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-06 02:26:48.296362', NULL, false, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', '', NULL, '', '2026-04-06 02:50:34.71556', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'nope', NULL),
	('3d8d4164-c4b8-415b-bf0c-4845d33be00c', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-03-27 05:36:55.957317', '2026-04-06 02:51:07.437474', true, '5f236ee4-d94b-4d90-bb3e-efc5294a9a7e', 'peram', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', NULL, NULL, '', '2026-04-01 02:26:40.368931'),
	('6e8fa2aa-2f4d-40eb-aba3-d1e834c72624', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-06 03:03:46.401514', NULL, false, '9b206d15-f4be-43e7-b680-f869d2ce4ded', '', NULL, '', '2026-04-06 03:04:45.982', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'noo', NULL),
	('5704c83d-aa6a-4b93-82c0-95c64d54a143', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-06 03:36:13.440574', NULL, true, '65ba725c-d900-4482-b0a6-49689e378007', 'test', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', NULL, NULL, '', '2026-04-06 03:38:19.882248'),
	('3f14a5ac-f49c-4079-af51-e1429a49c238', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-06 03:38:01.207954', NULL, false, '9b206d15-f4be-43e7-b680-f869d2ce4ded', '', NULL, '', '2026-04-06 03:38:27.518747', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'nope', NULL),
	('a09ffc9d-739a-42b6-99ea-beb5caa6a97e', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-06 02:52:08.941699', '2026-04-06 03:48:24.672731', true, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', '', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', 'Rupert Dimagiba', NULL, NULL, '', '2026-04-06 02:53:20.66127'),
	('de7bb9a7-de41-4c91-8922-69b32cd84c2a', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-06 03:54:37.432537', NULL, false, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', '', NULL, '', '2026-04-06 03:56:46.367893', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'no', NULL),
	('ad741f5e-eb12-44b1-b611-de5738dc8447', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-06 03:57:40.898271', NULL, false, '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', '', NULL, '', NULL, NULL, '', NULL),
	('cf3ba893-5e91-476f-b144-c1250bc103af', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '2026-04-06 12:41:38.709094', NULL, true, '8200d6d6-6c03-4a8e-be1c-9aad180e0400', '', '515d239f-b702-478c-9a96-8504d1feedf0', 'Rim Vernon Dimaandal', NULL, NULL, '', '2026-04-06 12:42:15.003861'),
	('9bc91ff2-f4c5-40fa-b9f9-ba4fff57ee72', '37a8f454-8797-4aa9-b530-8c692c5695b4', '2026-04-10 00:23:11.315772', NULL, true, 'aabd45ba-26db-49f4-9dd6-bdd35700f495', '', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'Ruiz Miguel Sapio', NULL, NULL, '', '2026-04-10 00:23:34.68473');


--
-- Data for Name: asssetStatusHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: issueReports; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."issueReports" ("id", "assetId", "reportedBy", "description", "status", "reportAt", "image") VALUES
	('cf46817e-b288-482f-9875-ade8d45c19aa', '65ba725c-d900-4482-b0a6-49689e378007', '37a8f454-8797-4aa9-b530-8c692c5695b4', 'Test', 'resolved', '2026-03-24 06:15:15.730121', NULL),
	('61122702-a53f-4bf5-88ed-5518575b4723', 'ea61acb2-26c9-4ee4-90a9-c6c8a92589ba', '37a8f454-8797-4aa9-b530-8c692c5695b4', 'issue', 'resolved', '2026-04-06 03:05:35.514466', 'https://efdhhuibnmebekqkjjom.supabase.co/storage/v1/object/public/reports/7769e24b-a677-49a7-8e7d-5178a06a1efe.jpg');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notifications" ("id", "type", "title", "message", "is_read", "createdAt", "recipient_id", "actor_id", "asset_id") VALUES
	('3948f3f2-7918-46fb-80f6-2f0d0ed68386', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Mac Book M4 Pro has been approved.', true, '2026-04-06 02:17:03.407911+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('268d2533-c541-4a4a-8b5e-2445c1ece50f', 'REQUEST_REJECTED', 'Asset Request Rejected', 'Your request for Mac Book M4 Pro has been rejected. Reason: nope', true, '2026-04-06 02:50:35.449354+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('ced4fb4d-c02b-4662-baeb-dbb4e6cb389b', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Mac Book M4 Pro has been approved.', true, '2026-04-06 02:53:19.378532+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('5d54ef3c-64cc-4498-ac65-ce2e35362f40', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Mac Book M4 Pro has been approved.', true, '2026-04-06 02:53:21.517435+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('a80d9eef-4fef-4f84-8521-da2fabf5fe19', 'REQUEST_REJECTED', 'Asset Request Rejected', 'Your request for Mac Book M3 Pro has been rejected. Reason: noo', true, '2026-04-06 03:04:46.709493+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '9b206d15-f4be-43e7-b680-f869d2ce4ded'),
	('859b91df-130f-4221-8156-868ea455cf1e', 'REQUEST_REJECTED', 'Asset Request Rejected', 'Ruiz Miguel Sapio rejected asset request for Mac Book M4 Pro (AS-01). Reason: no', false, '2026-04-06 03:56:47.762349+00', '515d239f-b702-478c-9a96-8504d1feedf0', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('6a739825-d2a9-4f6c-8dd6-884fed35dd4a', 'REQUEST_PENDING', 'New Asset Request', 'John Doe requested asset Mac Book M4 Pro (AS-01).', false, '2026-04-06 03:57:42.012315+00', '515d239f-b702-478c-9a96-8504d1feedf0', '37a8f454-8797-4aa9-b530-8c692c5695b4', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('3e5c82ce-a4be-4bd2-ba8a-6aee4936c13d', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for MSI Thin A15 has been approved.', true, '2026-04-06 03:38:21.218667+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '65ba725c-d900-4482-b0a6-49689e378007'),
	('3807b409-0bbf-4cd9-aaee-83fa656d9225', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for MSI Thin A15 has been approved.', true, '2026-04-06 03:38:21.605409+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '65ba725c-d900-4482-b0a6-49689e378007'),
	('5a472f8a-0de2-43fb-8c18-0288c69295cb', 'REQUEST_REJECTED', 'Asset Request Rejected', 'Your request for Mac Book M3 has been rejected. Reason: nope', true, '2026-04-06 03:38:28.240961+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '9b206d15-f4be-43e7-b680-f869d2ce4ded'),
	('0b4c663b-43e4-49c2-bfe2-868778dfdb80', 'REQUEST_REJECTED', 'Asset Request Rejected', 'Your request for Mac Book M4 Pro has been rejected. Reason: no', true, '2026-04-06 03:56:47.056502+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('402f0961-7e96-4865-ba7a-6db1a8e74b7c', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Logitech (AS-08).', false, '2026-04-06 12:17:10.152296+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', 'f21342d4-e9a4-43db-88d7-7ce1d1551d79'),
	('7b2b311d-b2f5-486a-a0a7-98c19c6c6cb4', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Logitech (AS-09).', false, '2026-04-06 12:19:25.568312+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', 'aabd45ba-26db-49f4-9dd6-bdd35700f495'),
	('8c9d7566-0473-48f0-9327-367ff5315a4e', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Razer (AS-10).', false, '2026-04-06 12:22:36.931727+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('6145dd8a-7124-48cb-b0f8-d4de4f43aa9c', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered HP Series 3 Pro (AS-11).', false, '2026-04-06 12:24:46.506951+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '17fdb135-ab0c-487b-b31e-94aeea827a3e'),
	('8c19f935-59e0-49d8-9994-8500fa6188c6', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered HP (AS-12).', false, '2026-04-06 12:30:30.112198+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '0e8dd72c-bc7a-4cb7-9c9d-58d6d4bd1929'),
	('884a09e3-4ff7-4e20-89ba-312fae0c44e7', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Asus (AS-13).', false, '2026-04-06 12:33:36.95132+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '0b3ae9bd-104d-4875-9753-d8bdd27ecc95'),
	('aa14a38f-998c-40c7-8946-8a9cf20a39c7', 'asset_updated', 'Asset Updated', 'Rim Vernon Dimaandal updated asset Asus (AS-13).', false, '2026-04-06 12:34:32.599859+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '0b3ae9bd-104d-4875-9753-d8bdd27ecc95'),
	('5eb663e4-c185-4569-80f0-3c20484d5407', 'REQUEST_PENDING', 'New Asset Request', 'Rim Vernon M. Dimaandal requested asset Razer (AS-10).', false, '2026-04-06 12:41:40.3282+00', '515d239f-b702-478c-9a96-8504d1feedf0', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('7994db50-fb39-4e25-9796-e1a5f327a9af', 'REQUEST_REJECTED', 'Asset Request Rejected', 'Ruiz Miguel Sapio rejected asset request for Mac Book M4 Pro (AS-01). Reason: no', true, '2026-04-06 03:56:48.182889+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('d8c0c413-2b8f-4291-95b5-c0c3447a6b1f', 'REQUEST_PENDING', 'New Asset Request', 'John Doe requested asset Mac Book M4 Pro (AS-01).', true, '2026-04-06 03:57:43.39959+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '37a8f454-8797-4aa9-b530-8c692c5695b4', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('272185b1-1246-4ae1-a8c0-87256ce740c3', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Logitech (AS-08).', true, '2026-04-06 12:17:10.365198+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', 'f21342d4-e9a4-43db-88d7-7ce1d1551d79'),
	('ecf59ccc-bcb1-4771-9e70-95f597fed65c', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Logitech (AS-09).', true, '2026-04-06 12:19:25.726534+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', 'aabd45ba-26db-49f4-9dd6-bdd35700f495'),
	('306abbf0-d8a3-49b5-af13-b7344c623ebf', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Razer (AS-10).', true, '2026-04-06 12:22:37.070262+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('c81c7d67-733b-460f-8c24-cd674adb2844', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered HP Series 3 Pro (AS-11).', true, '2026-04-06 12:24:46.905101+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '17fdb135-ab0c-487b-b31e-94aeea827a3e'),
	('24661bc2-2305-4672-91de-d11cdb725ba3', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered HP (AS-12).', true, '2026-04-06 12:30:30.261795+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '0e8dd72c-bc7a-4cb7-9c9d-58d6d4bd1929'),
	('6f0ff408-d314-4d3c-8e82-a1c1d12f7824', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Asus (AS-13).', true, '2026-04-06 12:33:37.102957+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '0b3ae9bd-104d-4875-9753-d8bdd27ecc95'),
	('b459b595-723e-4301-a13f-2e6c7a8bf981', 'asset_updated', 'Asset Updated', 'Rim Vernon Dimaandal updated asset Asus (AS-13).', true, '2026-04-06 12:34:32.535666+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '0b3ae9bd-104d-4875-9753-d8bdd27ecc95'),
	('ed791685-2ff8-4739-b3e5-1eb88c4eb3f1', 'REQUEST_PENDING', 'New Asset Request', 'Rim Vernon M. Dimaandal requested asset Razer (AS-10).', true, '2026-04-06 12:41:40.372494+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('b3742a40-6c2c-4b9e-8dc1-3ec2106562b4', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', false, '2026-04-06 12:42:12.497908+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('97134cb4-659a-433e-8306-8cb87149f4c6', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:13.283011+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('db748d93-0f3e-4a21-ba4d-27c3c29c7eb3', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', false, '2026-04-06 12:42:14.403326+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('f5cbfd28-7633-4a39-b2c9-d9461b791b23', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', false, '2026-04-06 12:42:15.19347+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('ac9055fb-fbc6-449d-b2b2-b30a741e8221', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:15.287383+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('230d1450-0c5c-491b-b0e4-d75331ce0776', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', false, '2026-04-06 12:42:15.331426+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('5e8093ef-e870-43cc-8eba-2667ff9fed8a', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', false, '2026-04-06 12:42:15.332441+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('109e4f20-1548-454d-bbbf-5c4cc4262f50', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:15.37568+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('2d4dceb1-870d-4c2d-bb0f-2f79c5aeeee6', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', false, '2026-04-06 12:42:15.846132+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('3c4dbe6f-4c42-458d-99ec-2736db96f7c9', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', false, '2026-04-06 12:42:15.99232+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('63f927cd-61c8-45ae-bd93-61404c6b0075', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:16.304183+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('cb3db929-5ad8-4f40-a016-a4e34e823eec', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:17.372403+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('9cb4615c-6d4b-4d49-805f-f7e61085b818', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:17.668144+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('13c73c26-7516-470a-885d-609b70b2ec43', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:21.174054+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('d9fd339a-b6f6-4371-af27-762844ff1304', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:14.554963+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('de80b29f-a694-4c5f-be29-8fd4a85eb24f', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', true, '2026-04-06 12:42:14.688906+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('8c49dc77-c298-4ccc-8746-51946dbdb7df', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:16.430272+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('17ffa601-1a3e-4547-a55f-03080ffff0fb', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:17.104774+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('d1e1fe88-751e-4be7-b333-d54c4c11ce3d', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:17.170474+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('f6da4f98-5568-4019-8ac1-86736f45cc7e', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:17.800275+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('9121901f-797f-4df5-ae9c-d44ec4598686', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:13.738911+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('5de9e8fa-1acc-4216-95c8-10b7fa810424', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:15.7875+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('b173cdae-3b2d-4494-a725-46234985ded4', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:16.689041+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('bfdfe2a4-71bb-4779-ad4d-cda99d901239', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:16.726655+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('25c1a0dc-08e4-4226-b657-f792b8e069c4', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:17.235818+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('b75eda8f-41e8-4a1d-b781-26cd67aee3ad', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:17.342475+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('ec5800c4-413a-4462-9e2e-058bee264436', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:18.117005+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('a4cbeddd-189e-42bb-841e-a802270a4969', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:19.679942+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('b4eaf349-e3a7-42d6-bc0f-be1cf942c745', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:21.782947+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('556e17ab-6bfd-499b-abc8-dbebea9407e8', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', true, '2026-04-06 12:42:19.696462+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('3fe29fa5-d773-43e6-8d44-62f5dd25ac55', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:16.229157+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('83e2b0de-8332-4adb-a21f-61a1bc9c0940', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:16.958765+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('ca6e2a96-7a8e-430e-b004-3bf2104344de', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Razer has been approved.', false, '2026-04-06 12:42:17.491954+00', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('4818beff-e8f9-4b38-b451-b9d4ff4e44e4', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', false, '2026-04-06 12:42:18.29655+00', '515d239f-b702-478c-9a96-8504d1feedf0', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('4d539e46-0718-4435-ae49-b03b00057553', 'REQUEST_REJECTED', 'Asset Request Rejected', 'Ruiz Miguel Sapio rejected asset request for Mac Book M4 Pro (AS-01). Reason: no', true, '2026-04-06 03:56:48.596181+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('1c13b1de-4412-43e1-ac3b-d662af6c5622', 'REQUEST_PENDING', 'New Asset Request', 'John Doe requested asset Mac Book M4 Pro (AS-01).', true, '2026-04-06 03:57:43.277288+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '37a8f454-8797-4aa9-b530-8c692c5695b4', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a'),
	('ff0a3da4-c364-4fd9-a2f7-7c5714c61c5f', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Logitech (AS-08).', true, '2026-04-06 12:17:13.32597+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', 'f21342d4-e9a4-43db-88d7-7ce1d1551d79'),
	('edc68ad9-0b8c-430f-9cf2-6708fadcebcd', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Logitech (AS-09).', true, '2026-04-06 12:19:27.141649+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', 'aabd45ba-26db-49f4-9dd6-bdd35700f495'),
	('4f0c860b-8672-4bad-8547-97c208c28c47', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Razer (AS-10).', true, '2026-04-06 12:22:38.93321+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('bd0d7201-613e-49b7-9937-b9746d998647', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered HP Series 3 Pro (AS-11).', true, '2026-04-06 12:24:48.104408+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '17fdb135-ab0c-487b-b31e-94aeea827a3e'),
	('df07dd45-c10f-436b-b204-0d39d9544ea1', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered HP (AS-12).', true, '2026-04-06 12:30:31.142974+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '0e8dd72c-bc7a-4cb7-9c9d-58d6d4bd1929'),
	('e135f568-d8bd-4b5b-b58f-3f4ae756490a', 'asset_registered', 'New Asset Registered', 'Rim Vernon Dimaandal registered Asus (AS-13).', true, '2026-04-06 12:33:38.435312+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '0b3ae9bd-104d-4875-9753-d8bdd27ecc95'),
	('4ee63d33-674c-452a-8bd6-324040c9f06f', 'asset_updated', 'Asset Updated', 'Rim Vernon Dimaandal updated asset Asus (AS-13).', true, '2026-04-06 12:34:34.169716+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '0b3ae9bd-104d-4875-9753-d8bdd27ecc95'),
	('65473ea4-8434-4e97-be30-727a37dea706', 'REQUEST_PENDING', 'New Asset Request', 'Rim Vernon M. Dimaandal requested asset Razer (AS-10).', true, '2026-04-06 12:41:41.695211+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('cd1b9052-ab6c-47c2-969b-27fb12fb8a94', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:17.801277+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('edef86c6-7646-4674-b77d-863731aaf85e', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:18.55458+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('534bd4e0-edae-47c2-a7a1-f0956a55edcb', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:20.855731+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('b5db9086-3dcf-4a35-b5d0-b7ab5a87926e', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:22.29051+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('0016bcfa-bac8-4e9e-8fff-65dfcff8b040', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:19.268005+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('e363b9f3-e478-4849-b088-0033a4ade4dd', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Rim Vernon Dimaandal approved asset request for Razer (AS-10).', true, '2026-04-06 12:42:18.803418+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '515d239f-b702-478c-9a96-8504d1feedf0', '8200d6d6-6c03-4a8e-be1c-9aad180e0400'),
	('30a4807d-6a5c-46e7-a4ca-e88fd759918d', 'REQUEST_PENDING', 'New Asset Request', 'John Doe requested asset Logitech (AS-09).', false, '2026-04-10 00:23:11.890596+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '37a8f454-8797-4aa9-b530-8c692c5695b4', 'aabd45ba-26db-49f4-9dd6-bdd35700f495'),
	('494e8ef9-d349-458d-8e3c-2de26d9cec9a', 'REQUEST_PENDING', 'New Asset Request', 'John Doe requested asset Logitech (AS-09).', true, '2026-04-10 00:23:11.983562+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '37a8f454-8797-4aa9-b530-8c692c5695b4', 'aabd45ba-26db-49f4-9dd6-bdd35700f495'),
	('d1d15c6f-e212-4f0b-a357-60c645263295', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Ruiz Miguel Sapio approved asset request for Logitech (AS-09).', false, '2026-04-10 00:23:35.818337+00', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'aabd45ba-26db-49f4-9dd6-bdd35700f495'),
	('3a94ec89-4589-4392-b22d-65c623dfc7fb', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Ruiz Miguel Sapio approved asset request for Logitech (AS-09).', false, '2026-04-10 00:23:36.099686+00', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'aabd45ba-26db-49f4-9dd6-bdd35700f495'),
	('cf514830-4f4d-40ae-b1cf-9466ce55f0fa', 'REQUEST_ACCEPTED', 'Asset Request Approved', 'Your request for Logitech has been approved.', true, '2026-04-10 00:23:35.346646+00', '37a8f454-8797-4aa9-b530-8c692c5695b4', '4d78e3c2-8361-4a0e-8360-a717e2ed6d76', 'aabd45ba-26db-49f4-9dd6-bdd35700f495');


--
-- Data for Name: password_reset_otps; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."password_reset_otps" ("id", "user_id", "otp_hash", "reset_token", "expires_at", "used", "created_at") VALUES
	('594602ec-14de-4d57-ae5d-16cdbf9275ee', '37a8f454-8797-4aa9-b530-8c692c5695b4', '$2a$10$v4NHgnbTUCOtes52bdcrqe9BaY1VQffTCVaHmfLaGfK9TK7fG91B6', NULL, '2026-03-23 06:45:23.46689+00', true, '2026-03-23 06:35:23.603985+00'),
	('7bea3a33-2895-46b9-8e14-50954ee34c03', '37a8f454-8797-4aa9-b530-8c692c5695b4', '$2a$10$1xdqwgM1Yfde43iFPwLenuMG2N0vpN4WjuGt9yeox2zcOIiS0JoVy', '3606b5bb-cb1d-4767-a8c5-9cbb69fd7c9f', '2026-03-23 07:08:55.727294+00', true, '2026-03-23 06:53:37.139909+00'),
	('1e4cfdfd-2821-4267-906e-c229acc17815', '37a8f454-8797-4aa9-b530-8c692c5695b4', '$2a$10$4nRCMQdpsTYLApkw802aQuLmE0n08cM4DCodpXbRz8R8JTOaYr8ri', NULL, '2026-03-24 15:09:31.691028+00', true, '2026-03-24 14:59:31.828566+00'),
	('8ad25e04-3fc6-4838-a838-68c95b9fa905', '37a8f454-8797-4aa9-b530-8c692c5695b4', '$2a$10$2tNlgFAmI5OAg8laVvgJZ.yMT0c.AuN/QRnwkh/sCVQn3/lOH1hzm', NULL, '2026-03-24 16:09:53.882008+00', true, '2026-03-24 15:59:54.019921+00'),
	('78218bd8-25eb-4d09-9e31-6aa59866c9df', '37a8f454-8797-4aa9-b530-8c692c5695b4', '$2a$10$S8qUc/aqPig2kTBmDx9DnufIY/PqJO5hvwK.6pNKQuT6YAXawyj4e', NULL, '2026-03-24 16:11:55.689939+00', false, '2026-03-24 16:01:55.836253+00'),
	('3210a51c-50a3-4798-b50b-6e026f99f4fa', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '$2a$10$zwXpJPXZPmE.Wbs2sFvEeOzTxZ1YUOJF3IK4wd9mkQV2JUjBT/Yu.', NULL, '2026-03-27 02:44:22.190881+00', true, '2026-03-27 02:34:22.284247+00'),
	('62b42aa0-f83c-42ee-8720-2e144c8236ae', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '$2a$10$0b6Cjh4XbrfHAOh52qc9v.mPlGyG/cF1X.M0DZKsKLsk5nY6QeTce', NULL, '2026-03-27 02:55:38.057349+00', true, '2026-03-27 02:45:38.15128+00'),
	('a31b28e8-717a-4278-92b1-28aeff84585a', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '$2a$10$ZkdGFM90JBDxQfErWqTtp.oNZN8JmnrutvcSvH8AiC9ct6qevPpoC', 'fc706a16-5cfd-4f4c-b1e6-1d44b850a5d6', '2026-03-27 03:05:02.758447+00', true, '2026-03-27 02:49:37.357071+00'),
	('70aa2393-a478-42d4-98de-b366d36c3102', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '$2a$10$/oKmzf93AMgefzGmAKWBKu0bMjqfqISXX0M5ATBBvqrF.rgI7jTSG', NULL, '2026-03-27 05:41:59.590528+00', true, '2026-03-27 05:31:59.696242+00'),
	('3bc1e461-2da5-4dd0-897e-23afb0acf653', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '$2a$10$9bH4eB6Wgqzjc6.O8YchBuiKchbaaxrYD/Alkap4s2Z1mnAWpTrk.', NULL, '2026-04-01 05:41:12.422943+00', true, '2026-04-01 05:31:12.559924+00'),
	('ee9612cc-4707-40ac-8d66-38efc01aa147', '0b84b3d5-7a19-4749-a4f7-ece889fb9653', '$2a$10$nP5P1iBiDffu4RzWA4aV6eXaoZzQ2Het3qMQ2jHG9QTJ.XkLdJ/yi', 'e2d112e0-d4de-4ebb-b8c6-42bd81ad0e1d', '2026-04-01 05:52:51.671445+00', true, '2026-04-01 05:36:12.081935+00'),
	('b4a14be2-c75d-4847-88cb-790395eef9e4', '515d239f-b702-478c-9a96-8504d1feedf0', '$2a$10$bB3szBc7AMrfrXZejtt65ev7c1rthHl7j7go9dxgdop98aO8SKTRe', '3cea6137-b2e9-4474-89ee-cd71d1262c68', '2026-04-01 14:15:34.694584+00', true, '2026-04-01 14:00:07.2752+00'),
	('f2d16c7b-3487-4bb6-a636-38a0b0a020c9', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '$2a$10$.f7AWZ.v7pLA/0yn4Mtade4QZ1ldkhFMqaunTqogJWyZX8lm9hkhm', NULL, '2026-03-27 05:43:53.486643+00', true, '2026-03-27 05:33:53.580526+00'),
	('b3fb7dc4-8b93-4220-8af5-431e6ffa1370', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '$2a$10$BHkYiDcL0/vkYw8SDB5by.LsQEocGyaUNZ/gF1JaCE3IheyeKO4qG', 'fd75d429-c5e1-4c25-9a74-4e401533f89e', '2026-04-01 14:48:09.592354+00', true, '2026-04-01 14:32:12.757911+00'),
	('75785fc0-cdea-41a4-a656-d58dd72a77f0', 'dffb7e87-412c-42f8-a505-85ad81c6b07e', '$2a$10$Bh.duZqFbfDT4tYjIzAYkuf1HzMKmBr9DsfRP6qkN6Xq2U0kgFOJq', 'ec4d310f-7c8e-4eca-979e-7e3ddc1df4d8', '2026-04-06 12:11:43.552162+00', true, '2026-04-06 11:56:10.017562+00');


--
-- Data for Name: qrCodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."qrCodes" ("id", "assetId", "qrValue", "generateAt") VALUES
	('b69cf6fc-a3af-49c3-9ef9-364de0e587d8', 'e9da18f8-e008-479d-9f5c-6afe5545fb86', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB/0lEQVR42uyYPbLkIAyE20VAyBE4Cjfzz804CkcgdEDRWxL2W8/OizayXFYyNfaXyBJNS3jjjTf+LxaS3JGA2D2zI1cEecZnAQCmPWayAEhOfkI+XtgBHLntMbuKhRWOZWpBcIsAWyizr8mRNAsgNURqmux4IqA9qc24DG5rvzTt3QHVh5jPau4CfAvIzYERMSOUhTVxx/ybpN8cOFSOh0g3xNUxT/LvYUBafUmUAxZy8yRr6h/fwQIgHSj3kPRhlivJVfCapgWgIa2Qk6XFcjsEmIwBcDVJmqxxVV8QD21YHgXIldR9SeOfWjpHwhdbgDSj6oPKoBuWjntcTQEtsHstz7iStHzHEzMAGpJ4OVfjNnptYkVHfBjgmGfP3IBlFzx2BOLyHSwAIoM8vZy0p9Q3S5eaAhC4SlKhSJXU3YmYf+jD7QFRg02PU9QhwZcZSB0/+vAMYHGUYUHmhp8rSZ0rTAEi3SzJVXHckubET4NhAtA3OoxOml9cXcVVH0wAYx+F9mMP5EH/WrsZB85ZzwkXKONDA7q/Csj9gTNNnejGydJVz9+eNAGMHcjhqyXNTdP8ZwV6d+DcR8kop/uobbTc8kQAx6yHIYPfezkTQEIQF5SPal5dkAngWB5qT2rMrqZJZyFDwFgesoWy6HQQtzEdrI8C3njjjc/4EwAA///SU0hXYVZXDgAAAABJRU5ErkJggg==', '2026-02-27 03:31:07.508918'),
	('257aaf46-405c-4b86-a980-81253a3dfc4a', '290a3fe6-6b3a-4e2c-8cbf-f02d7b20963a', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtNa+AAACBklEQVR42uyYMY70KhCECxE45AgchZuNPTfjKByBkAC5nqrx03pGE/2RsdzS7mpnvqTtoqhuPPXUU/9WK0k2gCwAkv7rQb95LwCAa0i+wrEmIG4I+fhiHsCT7xYzQnnBunU9ZLLMCLCHom4BvDAtkE1lFd4kd0PANBmzr3oA7EvBL9FeHTB/iLmH8lpq8i2+fxnIxYFR42QtNdnJ+mHpFwckOXn1sDd1vOuPOfedANa0yf9q3BfmvpSV/NTkFID8Acm6Ddk33Uwguc0G7Avp9VGguRySO7ncDMAByR9W9dfipqzTvvPc5MAqF190HUW9VAxNnh/UDADIvOpKYnHUS5UNpl1uMRMAJGkSUJvAwreuo4WTAYFvFpjkzN7gK3ZE3gwYz6Ej7kDqi2U5SXMmQCdrZUkWfapOlswcf5qcAjhunyR/GHeRyp2y3BSAr2mMcso6avNlkvurWwCrr0litJeqIaisPdC109w9A6AfjQ/HyYItEdwpBU0BeOaXmZ3Gh6FJAzgb4IZXY0wHupJOXn0P4Jj1FBxgno61A/uH218fOJaHiRXOxoc4diAf48P1gbEDIcLIcg1utImpgGPtZonU9lFDct8r0JsAyg8tcOSH9HP9eH0gWzCtkCaPYDoVcGzdBdj4YGtrfIv26sBYHv5/sjQLyR9a3G4FPPXUU5/1XwAAAP//df7GO1Av6jAAAAAASUVORK5CYII=', '2026-02-27 03:39:51.593754'),
	('6be7dfd5-8de7-4f3b-9e86-254015fe4698', '9b206d15-f4be-43e7-b680-f869d2ce4ded', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB+ElEQVR42uyZsXHlMAxEV8OAIUtgKexMlDpjKSyBIQOO9gagbOt/31xw0YdGCO3nAAKwWNB44okn/i8ySfZYRuDhWRzrMoL8jPcCACw9FkceviX2uI9Qzl/YARy590ggHgAcyREKWQ0CgGtYfUuzWEaBKD22kwW+AncEtCcBNhmyMrxW81fTfjrwrQ9Vq6mT9XcB+WDgJ+LOlv4l6x8MZGhShQ0rpErC4fAXrb4DoKG7SGMAq2vpQNwsATJOC2tyTfODp2j64Wu2BIDkJtKmiSXXkbVYFbaAJvZAFuveVd4wO2+7FZCBJB9AvByQOL8DPE0B4nv2OVV7V6nYXEu4VNMEMJPiQDzmShLgqnImAMcivnpIywGuY3Us7HG7FZCn50kKBBHz9yPIBOBYsi7WSAF8lT+hKoYlYHbgWazxtaR+BMQEACTRB5WJlsRXy6xdvdwtgLl5E8IpfPFwDezGAIR5yk1Hyh4PR+LVshoANLepcgqcls4WMJDkOkCoK5C+j7ufYt0COBuRp5g71jzwYlktAF93t95wslF1SfEigyaA8/FwBG4IKnZvaZoA5ntUcfMlR0Zqtly+KwDfkrSnCkg1CABDND2U4esygFebZACYj4fJUbtQ5O33Svp8YOqDVCjLKadvumXp7//oMQ488cQTr/EnAAD//6+rqQ9lUqs7AAAAAElFTkSuQmCC', '2026-02-27 05:34:22.382109'),
	('01f92553-4d6a-4da3-b5e5-b70db8f7f52c', '5f236ee4-d94b-4d90-bb3e-efc5294a9a7e', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB+0lEQVR42uyYMZKkMAxFP+WA0EfwUbhZAzfjKD6CQwcu/taX6VqY7U0malEomXHzElnStyQ89thjv7OZJCsQmHVsI9mifuO9AABDxdT6H4x5aHE7PvgBArnWtAXm2bzljriR2SNAxGxuAnLTKbD1PNv+fw/OAcvJpJ9esNQEPiTttwOmD3Izv8YyhZrWTwLy5UC3pONrLCDz0D5I+pcDSjkewiCdBmZzM98MYJl2u4e0WElxD7zmpA8AM/P01oealqCgcvEGSBgQudbIQC6hTMO59BwAYJlWZpWUVVZN8k9JeCtgDnYPYElr74IkjMP5zfIANEw8GgcWhO7fOSc9AArWMuZJKm5uclU+jr6A2aorQ5VFkzeEgq57NwIUOB3D0QXZELRhpCtg1vRDRZM8ovmjf/ABxN4X6Ekq6hL070UfHABolmv6eAykUoz95OctAHN3tJIyGWR+BW5DvcwXLoC5bw9eiGxIK8t0VnsfQKTEvNn4IE2Xyp3bJBdAP26Hm6xpPXTvVsAx620saXkPQcA+/hUQD8B7eaiptUaND7RVz2l88AD0HYgwRSlUDD/cdAG8l4dFwqAnqafcZXtwH6BHkxjzYDL4zz24ACyavX8gt+G6JPl+oG/d0exl0hu7I/oD+vKQlnJ6hyzzdqTlVsBjjz12tT8BAAD//yDHuhWrdSYsAAAAAElFTkSuQmCC', '2026-03-10 04:34:47.152877'),
	('b9002c2f-e4de-4ae1-b2f1-b35c922a132f', '9c625694-4085-4d20-80aa-ec8459353077', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAABnUlEQVR42uyYvbHkIBCEm5IhUyEoFEKD0AhlQ5Apg6KvekC7eq9u3atjSuMt+tYZ5qcbPPHEE/9tbFScQGJdD0SG833kCXgBWE7EDKzHXhDO68gXENkMYAV28nPkEQB0wztzcw28r9srYCW8FQArWcC/l/3sQB9IW0mhKg/pyxCbHLgiMtA+fds8cwPbC8k+qar5iuy1PR0Qc8N6IGHRJWaS/T++ABbYCKIVLce81XbxBGhVNnHZ2lEDV5P21psugI3MTZM2ad72Scvyc9J6ALQktUpyW3o9C0jt3rwOAKB3alcEVtUCwn2hOADsV11JAUpK4LFrLsMVgJEBpIs+sVuJewNMzUZa8zLbPae7CvIASMAGE3vqV/ObSo03wGRefYu9opzo7hdfwNiiw6HYD4uKmYCLK4nVrtZEAsNvAzI58DFV40x2MuZQ4QsYrnlIvtLzkO/6wQfweQOxhdKLOlSXgDTtsCvmzX44NT9Az4OEAXng25PXzMB4vkptoflNHurk3807OzBetGzJiG5mrr0BTzzxxD+PPwEAAP//QNfV+sT+AKwAAAAASUVORK5CYII=', '2026-03-10 04:39:37.298698'),
	('7d99b4af-f5a9-4469-8945-736227b450ac', 'ea61acb2-26c9-4ee4-90a9-c6c8a92589ba', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB+klEQVR42uyYMdKkOgyEm3Lg0EfwUbjZADfzUXwEhw5U9CvJzDzv/2+00YhCCczwJSrLrZbwxBNP/FtsJNkBSVV/CjIl6X+8FwBg6VjZ7IFYgVSuD36AQB49219skMhDUiGrR4AysgXyDrdACVplDYF1kzsCVpO5CPBCKoKsp/mraL8dMH3IRVJ9xbaGrsBvAflyYEQubFCArIv8RdK/HNCSU60O5B5Z2LFZmvVmAFJ5RTK0fCJRIs/AAmS6AtjWowOwQizBXsucpgsgkGekCQPJYF/Whdx9AW09hhpoY2XPe9DHdLPuAEClO1o7ulyQ3qxJzF0A75bENp0mOJ2mB0ArUN9HmkDkHkh9eAKGyVFfndn1lPLBhnNSuXsA5nnUP3CParyrmiEtTU8AyLJ1rJJ4sOnNGv4h776ApoXI0LCMIYhs6/J/S/IBII3p4KNyL2A9Zzd3B2CzYmQxr82iQxBZlo7NFfDOL1l+EutC9d+zf3AAYKQpiWds4JhLl3mT4wJQd1NhHjTpVKf9ddbqWwCfWY9VdUS0SoEz0hVwLQ/XYI3Vph/5MV94AD47EDslAZaR5u4KuNZuanJsH8VRcj9XoPcAinWmRAwZPGN1CQhGmh1XS4Ir4Nq6h5aPMT6cw5H6At7Lw/F6TQc6Xd8KeOKJJ/6M/wIAAP//pgOhJturwukAAAAASUVORK5CYII=', '2026-03-16 00:05:09.031565'),
	('c6d05eb7-8a39-4e83-b083-e0f37b69eb4e', '65ba725c-d900-4482-b0a6-49689e378007', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAACBUlEQVR42uyZPbKkMAyEm3JA6CP4KL4ZPzfjKD6CQwcueksSbwd2J3oRolAwBTNforLcamnwxhtv/C5mkmxJPveRWyAXRHnjswAAQ0vskTuQ2QDE7fjBDxDItaVN06ygprmRxSGgj9NYc/AMJLKmlRUYufYnAlqTyN0uWR/J/qVo7w6YPmw9Fj3Nltb+TUDuDfyEnJkcFjD0r6J+a2A2ZZbjmRAltylU7ONJq58AgBWTvBrXIZcs70iLK6Aji5h3JFXDscwd2Me/+uACmLUXlQykxW6W5LePXFwBPW6DndKiviDtQQow8VEA1P4kBpZJXVBiBwZycQWEqgaOFXNDFhcUar4IpANg7pGLalratSZF5fJZBn0AcrtKNpNjADe2tDwM0JrcEMusFwyD+oePDLoAxDGwyNywipeTpCvY4AtgzYuIuZRmRdCpTnSPnoCjLW2iD6y5jzKXAid78AhAa9JckH2lYs52kcH7A7DGGmrS5UezxnqxrA4AfS3Si9YmAAZWnIvWBcCaxYqqyYF4OV1NnevxCQCOQkQsQ4uUYzTj7Qr4WR4eQ5CouO5ALs78/oAtD+Vm7dA013/SdAF8locrTRg08W8r0AcA1nll5KNu34pDwB5b1PFbWtJFJx0AtjyEtiTtqJOVpi/g0Acx1NqSNM2h/fdHj2/gjTfeuMafAAAA///KgK4a9g8btwAAAABJRU5ErkJggg==', '2026-03-16 01:24:59.187555'),
	('58b04f33-0beb-447d-b898-6a13279b6279', 'f21342d4-e9a4-43db-88d7-7ce1d1551d79', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB9klEQVR42uyYMdKrMAyE1+PCpY/go/hmCdzMR/ERXFJ42DcryOT/30v1qohBDYn5GoFYrYQ77rjj/+JJkhsQ2fV3JnJmnfFaAIAgYOhSI7nO3M4bfgAdbYUceMCyfc7cyO4SmJZtVdJ+gcZRSLZI7rgiYDVZiNwfQJ2pAx+K9tsB04fSZu6PNGrcyvpJQL4cOKIwUgAoffgg6V8OqORMq0dZkJvdVJr9WsBZgXoAe+IZTU/GF6C67NVKMzerSeEdroCZm4QBKCtJqVwcNTgD1EYDe7VsB47qA7eyXAuIMg7qvGVV5z28XPjZszwAh3FQFQZKzO00/HwOLoBsanCkCSQukU0XX8ChDybZWdIWOLC/Ve4iAEddEqnSTAMTRV4O6V2THgCoJg8rSo6KpNKUo1g8AXpZj6SWZPItbuK3mDsA7IhdJoemcmav97evvgbwnKgLSjs/KU2sZAubMwBHTdonZTuQJZr/XlwBJt29InNPox7vzfqrKwCoKztslLNBIRzD3bWA16xHG4LUgDmBPdEV8Foe6ud2WgnbgcAV8NqBKFUybgiWpjPgtY8yRyrl1iy0/7MCvQgQR1nl5cw/1A97OQ+AJp9VaW44WxJcAefWnQNPGx9kDxD+/rK+HTiVOQ4TaVsi2HSwXAq44447fsefAAAA///t31R4A+dQwAAAAABJRU5ErkJggg==', '2026-04-06 12:17:09.259486'),
	('64ea8d10-fc04-4a5f-a61d-79ad10df1624', 'aabd45ba-26db-49f4-9dd6-bdd35700f495', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAACAUlEQVR42uyYsbH0IAyElyEgpARKoTPb1xmlUAIhAcP+I/C9x81/0YssjxXd2V8iI1Yr4Yknnvhb7CRZAVvG3+byBi/PeC8AgKnjp6mIcDzg0/lCD2DJVw3JMu8skqZpPpFZJUDmkaaEXqAhkAWWZLsjMIoxEF6uVGqAnOZ/RXt1YOhDSM3nzZVoa3i1LwJycWBGSJgAmbdvkn5xQEqOFdGSh2PiO818MwCeh8uAZ4dnAzbLBARqAs5eBNGH6kXT5cmSpg5AfIHLAhyOFM0jaZQBe5u+oIlUFLDCNIA1HLcCwBIPl6M9O69jt+M77JqA3TLtZKIc42isryY24vc7aAAgarCmmQ3lCVUBkuLOHG3BXocvMCzoiwzeAgDJ7vLUkRKbE02XL7OrAkZiYkNJlmhnaa41qQJoiKeKy1wKN7hV7TUA50Aa51gtN2sDYl8E5B4AR+cVr2qGDGa5a6Yu44MGwJb4kiEIYXg5JzUZDX9lUAfAtA0zFPocHyRbs0xJKgB40WrM6UB8tbzsH8b7BsB71mueB7wMrwL1TzG/PPBeHjafZ2MNcwey+gcFwNyByNw9OhOGr+5OGfCzPPxxpKPkvqxA7wCQcpoclrXEtSY1AbaEM02K8f5c9VwfwHsgDacL6lbEPOsCzuWhffeh8CLTh8m5A/DEE098xr8AAAD//5IKZkJtoMDXAAAAAElFTkSuQmCC', '2026-04-06 12:19:24.501311'),
	('f0f96d91-0c41-4db0-90ca-7e81a2c44646', '8200d6d6-6c03-4a8e-be1c-9aad180e0400', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB8UlEQVR42uyYMc6sMAyEB6WgzBFylNyMwM1yFI6QMkWUebIDeqDd6q/WCDerha8JdmZs44033vhbJJKsgSyBFREIbF6e8VkAgKkCzbPPJbKGrfl8vLADOHITAEhVz7fCZ3I3CITMgonMI1lmgQZgLmhPBbQmQ26eW/V0FdO3ov11YOhDbn5f5hKd3qwvAvLbwAhN1gJ9079J+o8DCYgbmV3BVD0x73By8Gs2nwBIBc6auyRcDWzqTKspgMwTd4ixskRHdldgDRAvkpoUsWORRHUgdmsAC1INhFcA8744Zml7HgUkltjlOpUgH4BHTc5cTQFDDSLFX70klQ3oxgCtyZlZXYgqFcOkzAGpIrqCZbxc4W+29Axg/BX5lv7bVa1ScSZTQEPcDn2o6k5yRNIWkCBP9+hK2EY5rq5cxdwGQOZUQ1Y3FZXTJ/3WVz8BgPSqakCLDkFYgDjVy4cyAIz+U44ZVgHEWAuu/YMJAIir6INXeaP2cvHaP1gAzo60+T2N6WBSS7qu3R4AHLMeOQTkS/9gATjnbs1kiYBuD+4yaAA4l4faJWCMcrhPrAaAYx8lw9vYR226Qfh/sx4ESMfALhmtH9m0BGgvp2s3ODVWmAKOmpQfkpi56TGNATyN9ZwORsl9rEBtA2+88cY9/gUAAP//pyV7hZwTM6cAAAAASUVORK5CYII=', '2026-04-06 12:22:36.015096'),
	('622bd439-98b5-4b7e-8269-b28d2e61e5fb', '17fdb135-ab0c-487b-b31e-94aeea827a3e', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB9ElEQVR42uyYMbLkIAxEmyIg5AgchZt5PDfjKByBkIByb0nwt+zZH200clmZ7ZdgSa0WeOKJJ/4vXiTZkRF5BBKBO6K8470AAK4n+iZP2XcAsawPdgBPvnsiGzZ5DjwQC1ltAqxbaFmehlUA8E2P6vn7Mc0DWpPSWfXVI4d21r9F++2A6kMqI85s9vQevwjIlwMzEpVtmX022Gd8OfCjckA6EDmQds/iyP1eAMk9sLAl9lgGpMHycZ283w8A+U2WOU2LV6kAL//BACAfQ81AepOUzmKDMwZA1KBDZ1FXedsQuXrtPsBLhxAyW9qBLG9GpLvOrO8HRiyvjjwAx+UfcEm3BQADogbTV+tIEpegFtsQICq3HKk2mWh1w3EquVsAsixssjeImGtSpSZx+lEmALYl5tWRHKFKlbInU8BLjjkPJfZn1aQ7L6QWgBGLYxVfLTlDqJu/2oN7AL5hCyye9ce9DohzNQawuNlSUEeqmn5WexMAVMwxrSjYFTjpgw1gpWZETnuglu5Sk3cAViHq3jD3bsnoeTRbAE6Xh7IEiQzOqx6YAtYdiDpSXYTeekxjwM99FKub91GfNXknIP/dfkRAcHze9NoAMDurjLCySZoCZk1KluYQSsd0CTAFzMvDmSXS60gCe9pvBTzxxBPX+BMAAP//BYcXUPrutQoAAAAASUVORK5CYII=', '2026-04-06 12:24:45.309753'),
	('9b3e08e2-2640-46de-bf98-b85a8981929c', '0e8dd72c-bc7a-4cb7-9c9d-58d6d4bd1929', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB/ElEQVR42uyYPbLjIBCEmyIg5AgchZvp52YchSMQElDqrQY9r7zP0UZGpQlMWfocjBmamcYTTzzxf7GSZAXgM4Cob83rk/cCAJiqN9mwRLgM+HS+mAew5F6DklpcQdMzn8g8JaA0KyIct4kBWwJZYCtMuyPQazIkFizwbC4L+FW03w50fQip+by4Em0N+ycB+XJgRK9JnSyVZvsg6V8OqOSk1ZbcHNlwpplvBgBxQ0gkj6Eci+U/RTsBYItOFnu2Ptl+M4HkNhkQtUu2hA2eQ+VoZgOaT0Zq4PPa88uwBax/N+sWwOgYEG0J+7h59/4/5LkAMq2vNjTpmm1nGzERsJJpUUPd04Q6UunDbIBKrmqzYKr6grDZggOB9wI0LEhAyMOV2FzWT/RkJkC6vZNp6EM8xfwaUwC2xEMy4fOiRWkimksvNwUwtDo1z6FyHTguad4CWCXmoyb7EDS6IHO9s2YALNNaQzo9kOa4s8S3BmMKoGBxWWJ+jPFBB+y4CMgUAHxaK2JTmp4NMMOhWm8F/Mx63erpw6ugw+WpgNM8VJrnxcrugVwbjAmA0wM5d0lLT3My4OVHwXSV0zXL47cFehOAea2ecN3w/eTLTQCkl3kYNEWYd5Pk+4HhuuNncVRf3c33mQC+pE0ny9beMLCG7VbAE0888R5/AgAA///+YayozmlI1QAAAABJRU5ErkJggg==', '2026-04-06 12:30:29.342903'),
	('15d51d67-1e28-40ee-ab09-cb86b5041d05', '0b3ae9bd-104d-4875-9753-d8bdd27ecc95', 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB/ElEQVR42uyZMdajMAyEh+fCpY/go/hmAW7mo/gILl34Mfsk8e+S3VRbRTzUJJCvIbLGMwZPPfXU/9VKkiPX0PMRWQPbMpPc470AAMvIleQRe5lRgHr+4AcI5D4ygcwBzNjWmSrZHAIAO16xF7lyC2Sy552siNxwR0DXJMo5ZDPywIdF++3AqQ8zNe3myPtnAflq4KdI7uxFBmx+FPWvBlboQ9XQASSGgYUdR7xo9S2AmeorNsxEmSzR9NDLgby5AmSyyDqRd3YgtpWsR3zXBw/AK7YiwEAJA+uENGvzBCCwLrRmDZG3zJl4UbmbAOp5ssj3CygcWdYkLv+DC0Dvigy2RT+4hV7kqytA1CA2hNMFDblzVTkfgHWIEJXrCNIsVo683Q2AjVNbxAXhs3/4ckBEb2Ur+phSFh80UHgCkphpSaKqFshiFha7cgOYSKPopiqBlFRLh3sB4hZeJhcvW54i5hzOAN1YdaQOzXA8AomLI3UCcLONdR2JNDF3B5goFKQm9iBIwibfu3kD4BRzMd4cSduolrW5As7czd8pAnZg9ceZuwDOw8PQ82bZdLf4QFeAnUdpLLDzqL/X5J0Ays4bNTfwDK7+APNzI9UZtZtXL+cCsMNDBIrKQaPc+5bkAvh5AyJRLonCiUws498XPa6Bp5566r1+BQAA//9aI7n0ql1v8AAAAABJRU5ErkJggg==', '2026-04-06 12:33:36.120343');


--
-- Name: assetFloor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."assetFloor_id_seq"', 5, true);


--
-- Name: assetRoom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."assetRoom_id_seq"', 6, true);


--
-- Name: assetType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."assetType_id_seq"', 7, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."roles_id_seq"', 3, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict zHMQvRu325PpYaDlndxHd48UEAlDCcEtzcCiImIeqYneb8k3V4Omp2teXCbZrC7

RESET ALL;
