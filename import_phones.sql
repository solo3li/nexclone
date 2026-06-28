UPDATE "AspNetUsers" SET "PhoneNumber" = '+201278476041', "PhoneNumberConfirmed" = true WHERE "Id" = '6c705aa1-f613-49ef-97a9-82dd03d1bb9a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0fdb0b28-27b8-43ec-aa10-7ba600737098', '+201278476041', true, '2025-11-04 14:36:57', '2025-11-04 14:36:57', '6c705aa1-f613-49ef-97a9-82dd03d1bb9a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201204889217', "PhoneNumberConfirmed" = true WHERE "Id" = '6e17e6f9-749a-41b1-9988-5f9adb24156e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('11ae40cc-5c3f-4475-a77c-8c5a86c66d8a', '+201204889217', true, '2025-10-18 09:41:16', '2025-10-18 09:41:16', '6e17e6f9-749a-41b1-9988-5f9adb24156e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201114228664', "PhoneNumberConfirmed" = true WHERE "Id" = 'ea29f4ff-5ffd-4323-94c5-367fe37eb536';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c56bab20-ad71-4558-b34b-c1d30430a7b6', '+201114228664', true, '2025-11-11 21:17:29', '2025-11-11 21:17:29', 'ea29f4ff-5ffd-4323-94c5-367fe37eb536') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201007285564', "PhoneNumberConfirmed" = true WHERE "Id" = 'eaf36376-49f9-4393-bf9b-51f2ab1b9322';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2f491494-6334-4906-91e9-4f4a80b34ed8', '+201007285564', true, '2025-10-28 12:42:08', '2025-10-28 12:42:08', 'eaf36376-49f9-4393-bf9b-51f2ab1b9322') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223190990', "PhoneNumberConfirmed" = true WHERE "Id" = '36584f83-cb35-4544-955e-c059fe5d3f6f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('607e9ea7-ac22-4593-b3d2-22adf8bb2610', '+201223190990', true, '2025-11-12 09:15:18', '2025-11-12 09:15:18', '36584f83-cb35-4544-955e-c059fe5d3f6f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019064566', "PhoneNumberConfirmed" = true WHERE "Id" = '1a08487a-9f91-4873-b98d-b41a0b6618aa';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b64dd5db-89d9-4a3f-84e1-819c4df541ff', '+201019064566', true, '2025-10-02 21:49:15', '2025-10-02 21:49:15', '1a08487a-9f91-4873-b98d-b41a0b6618aa') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201065132972', "PhoneNumberConfirmed" = true WHERE "Id" = '26fa29d8-7d0b-40d9-b38d-76eafde7ba72';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4b8ba574-a89c-4346-987f-e4ad7e050598', '+201065132972', true, '2025-10-08 19:03:43', '2025-10-08 19:03:43', '26fa29d8-7d0b-40d9-b38d-76eafde7ba72') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201281535486', "PhoneNumberConfirmed" = true WHERE "Id" = '0b31d3b2-6a1d-4764-a1a9-9da48ddf79d5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ae2ac595-e7b0-4bd0-8940-edbbb839bf2c', '+201281535486', true, '2025-12-14 23:09:52', '2025-12-14 23:09:52', '0b31d3b2-6a1d-4764-a1a9-9da48ddf79d5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001547591', "PhoneNumberConfirmed" = true WHERE "Id" = 'e91deec4-90de-4d8f-b389-b2c6eeceaabe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6ba56c7b-c1ed-48e6-90f8-cc2e3669a54c', '+201001547591', true, '2025-12-16 18:30:42', '2025-12-16 18:30:42', 'e91deec4-90de-4d8f-b389-b2c6eeceaabe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201559190771', "PhoneNumberConfirmed" = true WHERE "Id" = '6f241dd8-bc6d-4e22-a620-bdb7c440036c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8342677b-f312-448c-837e-5cf1d6ba1413', '+201559190771', true, '2026-01-01 18:51:06', '2026-01-01 18:51:06', '6f241dd8-bc6d-4e22-a620-bdb7c440036c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201018295144', "PhoneNumberConfirmed" = true WHERE "Id" = '2c6807a6-819a-46e1-9ed6-df686598c247';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b6424bb0-6b09-4aa2-bf3c-558d73b29842', '+201018295144', true, '2026-01-08 00:28:30', '2026-01-08 00:28:30', '2c6807a6-819a-46e1-9ed6-df686598c247') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201029771692', "PhoneNumberConfirmed" = true WHERE "Id" = 'c02d660b-acd8-4e22-b78e-1f7f5fa35ab4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('118a426b-f568-4df9-bdb6-0334195da7c5', '+201029771692', true, '2025-12-20 23:23:29', '2025-12-20 23:23:29', 'c02d660b-acd8-4e22-b78e-1f7f5fa35ab4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201116020965', "PhoneNumberConfirmed" = true WHERE "Id" = 'fcb3ed85-cd9d-4b14-900c-2d7050215592';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ff6185cf-663e-4fea-a20a-80cccacc807f', '+201116020965', true, '2026-01-09 12:13:06', '2026-01-09 12:13:06', 'fcb3ed85-cd9d-4b14-900c-2d7050215592') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01210151808', "PhoneNumberConfirmed" = true WHERE "Id" = '22fba6b8-a950-4113-83eb-c34bdb12dfea';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('56098826-02ea-4d7a-8bdc-4e8656a88f38', '01210151808', true, '2025-12-02 21:45:46', '2025-12-02 21:45:46', '22fba6b8-a950-4113-83eb-c34bdb12dfea') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021336339', "PhoneNumberConfirmed" = true WHERE "Id" = 'fb96d208-1bc2-44eb-9c40-0836d3f8a060';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('135b01b6-dd77-461e-86e3-487ef001cb97', '+201021336339', true, '2025-12-20 06:09:22', '2025-12-20 06:09:22', 'fb96d208-1bc2-44eb-9c40-0836d3f8a060') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201014396611', "PhoneNumberConfirmed" = true WHERE "Id" = '26dff315-12e7-4b49-afb2-4263976dd418';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a2c65919-5f7c-483b-9787-b0396068cc8f', '+201014396611', true, '2025-12-31 10:37:41', '2025-12-31 10:37:41', '26dff315-12e7-4b49-afb2-4263976dd418') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01091386343', "PhoneNumberConfirmed" = true WHERE "Id" = '7545cd01-8add-4cc8-bf01-254759a807fb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e81cfc88-d0e9-443e-ab8b-597d175efdee', '01091386343', true, '2026-01-10 21:36:14', '2026-01-10 21:36:14', '7545cd01-8add-4cc8-bf01-254759a807fb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019201338', "PhoneNumberConfirmed" = true WHERE "Id" = '4ef4383d-bc81-4080-ae48-a3e6206ca2b5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9103a80d-2456-4001-8b0a-e044291466ee', '+201019201338', true, '2026-01-12 18:54:43', '2026-01-12 18:54:43', '4ef4383d-bc81-4080-ae48-a3e6206ca2b5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01069998908', "PhoneNumberConfirmed" = true WHERE "Id" = '634d19ea-7682-4253-a999-c083d2282253';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('338b870c-297d-4051-b8b2-d01e70b05a29', '01069998908', true, '2026-01-14 13:55:27', '2026-01-14 13:55:27', '634d19ea-7682-4253-a999-c083d2282253') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201115694835', "PhoneNumberConfirmed" = true WHERE "Id" = 'cf907049-68e3-45b3-ae44-6cd3d29c2bfc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ce3ee901-4cac-4812-95eb-3442704910be', '+201115694835', true, '2026-02-05 18:45:53', '2026-02-05 18:45:53', 'cf907049-68e3-45b3-ae44-6cd3d29c2bfc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099634171', "PhoneNumberConfirmed" = true WHERE "Id" = 'cc8ae9c7-c7f8-455f-b65e-ec2612d497b1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1c769a80-21b4-488e-9ee4-3ab7de32db05', '+201099634171', true, '2025-09-15 17:48:27', '2025-09-15 17:48:27', 'cc8ae9c7-c7f8-455f-b65e-ec2612d497b1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098899671', "PhoneNumberConfirmed" = true WHERE "Id" = '0cbf1159-5ea1-457f-9900-3e5adb887146';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ea4f1325-145f-4ca0-97c4-0de34b4554c3', '+201098899671', true, '2025-09-23 00:27:59', '2025-09-23 00:27:59', '0cbf1159-5ea1-457f-9900-3e5adb887146') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066830803', "PhoneNumberConfirmed" = true WHERE "Id" = 'ddad8843-6c4b-44cb-b208-f348579816c7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('96ecd72b-da56-4f4d-a322-a41728693bf9', '+201066830803', true, '2025-12-21 03:35:08', '2025-12-21 03:35:08', 'ddad8843-6c4b-44cb-b208-f348579816c7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201070504402', "PhoneNumberConfirmed" = true WHERE "Id" = '5af8abbf-628f-4a39-8219-904388f8c321';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2bcde517-1492-48a8-8b71-460b26ee76ff', '+201070504402', true, '2025-11-10 15:03:20', '2025-11-10 15:03:20', '5af8abbf-628f-4a39-8219-904388f8c321') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01153537228', "PhoneNumberConfirmed" = true WHERE "Id" = '97f10c07-5782-4a85-adc3-fd861cb57dec';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ddb89065-6158-4e0b-bda7-5350e48f75ec', '01153537228', true, '2025-12-16 18:30:27', '2025-12-16 18:30:27', '97f10c07-5782-4a85-adc3-fd861cb57dec') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061470636', "PhoneNumberConfirmed" = true WHERE "Id" = '4258bbde-d5a8-49fe-9e4a-57ee898eb3fc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5cf2ad5f-639f-4ac5-ad22-885006db3b24', '+201061470636', true, '2025-12-18 15:24:27', '2025-12-18 15:24:27', '4258bbde-d5a8-49fe-9e4a-57ee898eb3fc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01115571858', "PhoneNumberConfirmed" = true WHERE "Id" = 'd3746dc0-f04c-4687-a6b0-5a206c08f075';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b6533243-79ca-46b3-922a-1be42a5bb3b7', '01115571858', true, '2025-12-02 21:57:50', '2025-12-02 21:57:50', 'd3746dc0-f04c-4687-a6b0-5a206c08f075') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201100467399', "PhoneNumberConfirmed" = true WHERE "Id" = '32a56d9b-e326-4a64-92cc-74050fe257f1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('09f2f848-37fb-4c55-89cb-66ee5ae149fd', '+201100467399', true, '2025-12-14 23:28:49', '2025-12-14 23:28:49', '32a56d9b-e326-4a64-92cc-74050fe257f1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201044400801', "PhoneNumberConfirmed" = true WHERE "Id" = '26feef63-5d7f-4c17-8223-488fc10b9aa7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bf8395b8-e595-4b52-93f7-9f85139a0fe0', '+201044400801', true, '2026-05-17 18:10:20', '2026-05-17 18:10:20', '26feef63-5d7f-4c17-8223-488fc10b9aa7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201024985044', "PhoneNumberConfirmed" = true WHERE "Id" = '67c2067c-2aa6-4cd1-932e-018b0456968c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9822bb04-483d-41dd-b7db-d7691bf308ad', '+201024985044', true, '2025-12-20 08:04:49', '2025-12-20 08:04:49', '67c2067c-2aa6-4cd1-932e-018b0456968c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01057634686', "PhoneNumberConfirmed" = true WHERE "Id" = 'bbcb9dd1-2cae-42be-a45c-e95c40747659';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8f194259-7a18-4436-be42-f1949ba17cda', '01057634686', true, '2025-12-31 12:22:35', '2025-12-31 12:22:35', 'bbcb9dd1-2cae-42be-a45c-e95c40747659') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201221544892', "PhoneNumberConfirmed" = true WHERE "Id" = '6d47d3d7-9a43-495c-836c-88cc4e7779cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2a8b6849-796c-4484-b78b-081dbb91fdcf', '+201221544892', true, '2026-01-08 02:25:09', '2026-01-08 02:25:09', '6d47d3d7-9a43-495c-836c-88cc4e7779cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01015181418', "PhoneNumberConfirmed" = true WHERE "Id" = 'cb0043a5-7ecc-4c31-a0f0-5761c2acd015';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d40560cb-a594-44cf-b13e-d5cc761cdd9e', '01015181418', true, '2025-12-29 11:34:21', '2025-12-29 11:34:21', 'cb0043a5-7ecc-4c31-a0f0-5761c2acd015') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01016935114', "PhoneNumberConfirmed" = true WHERE "Id" = '149008fb-a377-44d9-a60b-375aafb5a48c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c006a347-9873-4283-9f06-5e29fc91cfaa', '01016935114', true, '2026-01-02 22:28:06', '2026-01-02 22:28:06', '149008fb-a377-44d9-a60b-375aafb5a48c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201226677594', "PhoneNumberConfirmed" = true WHERE "Id" = 'a4c2e80a-a33a-41ad-8213-2541e4b2ac33';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('abc263de-2da2-4f37-b278-5d39c68c8769', '+201226677594', true, '2026-01-09 15:58:58', '2026-01-09 15:58:58', 'a4c2e80a-a33a-41ad-8213-2541e4b2ac33') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201550577831', "PhoneNumberConfirmed" = true WHERE "Id" = '239a404d-94d1-4950-9a92-0f96b95fb7c3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ae302038-f149-45a1-a7db-f02c31d7e03d', '+201550577831', true, '2026-01-11 00:03:57', '2026-01-11 00:03:57', '239a404d-94d1-4950-9a92-0f96b95fb7c3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201110912198', "PhoneNumberConfirmed" = true WHERE "Id" = 'a853d9e4-dbb3-4329-ae9f-d6bb7a1cb439';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4deb126c-9f8d-4991-9096-822c6a8f88e6', '+201110912198', true, '2025-10-08 21:12:54', '2025-10-08 21:12:54', 'a853d9e4-dbb3-4329-ae9f-d6bb7a1cb439') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025823043', "PhoneNumberConfirmed" = true WHERE "Id" = '06fdce51-85b3-482f-a271-c9877bb01098';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5d0e2d3b-1c31-44e1-9ae7-bdeb402342b3', '+201025823043', true, '2026-04-12 18:25:02', '2026-04-12 18:25:02', '06fdce51-85b3-482f-a271-c9877bb01098') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201095046203', "PhoneNumberConfirmed" = true WHERE "Id" = '1ce600b0-4771-477c-9031-024368aa32fc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d6c41e2e-626c-4bd4-ae24-12e32b499329', '+201095046203', true, '2026-02-06 23:20:52', '2026-02-06 23:20:52', '1ce600b0-4771-477c-9031-024368aa32fc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+212645573706', "PhoneNumberConfirmed" = true WHERE "Id" = '786ceea0-ed4d-415b-95ca-d8bc71b24c7d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d1a3c11b-b285-47ae-b7d4-7a96b2d087a8', '+212645573706', true, '2025-10-19 17:42:58', '2025-10-19 17:42:58', '786ceea0-ed4d-415b-95ca-d8bc71b24c7d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201147898806', "PhoneNumberConfirmed" = true WHERE "Id" = 'ab90c290-2fde-456e-8ded-d430afd95195';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('14d0b7d3-5c4a-41fd-997a-b5be7ff6ba7d', '+201147898806', true, '2026-02-11 15:00:10', '2026-02-11 15:00:10', 'ab90c290-2fde-456e-8ded-d430afd95195') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201155575422', "PhoneNumberConfirmed" = true WHERE "Id" = '572e4d74-1b9f-4d94-8202-a01005cf7ed3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b406eebb-a90a-4742-827f-b146140b67e6', '+201155575422', true, '2025-11-10 16:03:19', '2025-11-10 16:03:19', '572e4d74-1b9f-4d94-8202-a01005cf7ed3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201006190369', "PhoneNumberConfirmed" = true WHERE "Id" = 'ecd61789-8766-44ad-b445-438e6f6137c0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e58950ee-93dc-4fb8-ba97-d23f19693524', '+201006190369', true, '2025-11-11 21:59:13', '2025-11-11 21:59:13', 'ecd61789-8766-44ad-b445-438e6f6137c0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004609191', "PhoneNumberConfirmed" = true WHERE "Id" = '049da33d-e8ce-49ec-a0f5-708847a1a897';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a3172b7d-9b70-41df-845f-8e3ce23703d2', '+201004609191', true, '2025-12-06 15:29:12', '2025-12-06 15:29:12', '049da33d-e8ce-49ec-a0f5-708847a1a897') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201114228271', "PhoneNumberConfirmed" = true WHERE "Id" = 'e65597ea-bd18-4b1a-a143-6638ce0b915a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fa4d58f2-f187-459a-8060-f8a5a0f6c19e', '+201114228271', true, '2025-11-13 11:19:33', '2025-11-13 11:19:33', 'e65597ea-bd18-4b1a-a143-6638ce0b915a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201007960197', "PhoneNumberConfirmed" = true WHERE "Id" = '4344a6e9-77ea-4eb8-bdd5-a76e3fc7bb6f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8085734b-17e8-446e-94a9-6b4c5c0310f2', '+201007960197', true, '2025-12-14 23:57:43', '2025-12-14 23:57:43', '4344a6e9-77ea-4eb8-bdd5-a76e3fc7bb6f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01555871877', "PhoneNumberConfirmed" = true WHERE "Id" = 'ec2c1550-421c-47b1-ba68-5ffb6b0dd1f6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('865a0759-141b-4561-b270-40ba46a79542', '01555871877', true, '2025-12-03 11:05:59', '2025-12-03 11:05:59', 'ec2c1550-421c-47b1-ba68-5ffb6b0dd1f6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201116869868', "PhoneNumberConfirmed" = true WHERE "Id" = 'c14e5cf9-a0bf-4935-8884-c1757d9d527a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('148b68eb-2a0b-4421-bffd-e155b13837ea', '+201116869868', true, '2025-11-05 16:05:42', '2025-11-05 16:05:42', 'c14e5cf9-a0bf-4935-8884-c1757d9d527a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201040353192', "PhoneNumberConfirmed" = true WHERE "Id" = 'b07cdf38-d70e-41a7-8864-2d04e094a037';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('30190e4c-9b05-4a28-b1cd-eb385dced3f7', '+201040353192', true, '2025-12-16 20:01:34', '2025-12-16 20:01:34', 'b07cdf38-d70e-41a7-8864-2d04e094a037') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201024083576', "PhoneNumberConfirmed" = true WHERE "Id" = '4eecb674-5246-4cc3-8277-a73870041e6c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3443a8e7-2453-4e04-acec-0eeefd85e3d5', '+201024083576', true, '2025-12-29 14:18:52', '2025-12-29 14:18:52', '4eecb674-5246-4cc3-8277-a73870041e6c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201225117677', "PhoneNumberConfirmed" = true WHERE "Id" = '42651d40-0f82-4c6c-8206-a177eb4e4515';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('27cfcfa2-8298-4de5-b836-e85b26b1e6ee', '+201225117677', true, '2025-12-21 05:23:07', '2025-12-21 05:23:07', '42651d40-0f82-4c6c-8206-a177eb4e4515') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201020451176', "PhoneNumberConfirmed" = true WHERE "Id" = '886a4506-1e94-46e5-8065-f88c09394e1f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('50ded950-82ce-4eef-9cc7-a6f028ba58d4', '+201020451176', true, '2025-12-31 12:49:31', '2025-12-31 12:49:31', '886a4506-1e94-46e5-8065-f88c09394e1f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201068527285', "PhoneNumberConfirmed" = true WHERE "Id" = '438c2c80-1892-408b-b745-20b69f4a1e33';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('11ec5591-efc6-489b-bee6-69d684f0b152', '+201068527285', true, '2025-12-28 18:51:59', '2025-12-28 18:51:59', '438c2c80-1892-408b-b745-20b69f4a1e33') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201096316113', "PhoneNumberConfirmed" = true WHERE "Id" = 'e3b71232-8ed1-4bf8-b11f-c59bf1a88d4d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3170ef2d-402b-450d-87f5-e364fd80cf35', '+201096316113', true, '2025-12-20 10:56:02', '2025-12-20 10:56:02', 'e3b71232-8ed1-4bf8-b11f-c59bf1a88d4d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01558120561', "PhoneNumberConfirmed" = true WHERE "Id" = 'cd8c0a30-1ce7-4172-aec8-e38cc26e7282';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8e74a12c-055b-4d8d-9d25-5fdaefc210be', '01558120561', true, '2026-01-03 02:18:31', '2026-01-03 02:18:31', 'cd8c0a30-1ce7-4172-aec8-e38cc26e7282') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201156381073', "PhoneNumberConfirmed" = true WHERE "Id" = '02cbff7a-3e04-4ea7-820b-b02594b2b636';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('13fe3531-56f3-4202-be48-0fd2755f1986', '+201156381073', true, '2026-01-11 01:03:10', '2026-01-11 01:03:10', '02cbff7a-3e04-4ea7-820b-b02594b2b636') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003541116', "PhoneNumberConfirmed" = true WHERE "Id" = 'd669d69b-f440-41d5-81a8-f2c806f31361';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c9835f5b-80fa-4fba-b14b-f494732f02cf', '+201003541116', true, '2026-01-09 19:43:29', '2026-01-09 19:43:29', 'd669d69b-f440-41d5-81a8-f2c806f31361') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091209594', "PhoneNumberConfirmed" = true WHERE "Id" = '058b0762-0709-47f8-9104-e3d965a9ccb3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('41528897-6012-4d7b-88fe-c05c9a7196b5', '+201091209594', true, '2026-01-12 19:51:46', '2026-01-12 19:51:46', '058b0762-0709-47f8-9104-e3d965a9ccb3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201145657562', "PhoneNumberConfirmed" = true WHERE "Id" = 'cb566188-e912-4908-aa41-d989f48123a9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e2462ddd-0dbc-4290-aa65-8b2aee4fed00', '+201145657562', true, '2026-01-14 21:07:45', '2026-01-14 21:07:45', 'cb566188-e912-4908-aa41-d989f48123a9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064830600', "PhoneNumberConfirmed" = true WHERE "Id" = 'ed2c01a3-8de7-43e9-a5ad-fd4892b86b84';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1cb372da-9a8f-4efb-b9a9-b8d67f536d2c', '+201064830600', true, '2026-01-16 16:58:36', '2026-01-16 16:58:36', 'ed2c01a3-8de7-43e9-a5ad-fd4892b86b84') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201155431975', "PhoneNumberConfirmed" = true WHERE "Id" = 'a36fd467-7cdf-4d81-9aac-4786bbaf40d1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1c29825e-ec2c-4c24-a94e-530c86bf2f76', '+201155431975', true, '2025-11-09 20:18:26', '2025-11-09 20:18:26', 'a36fd467-7cdf-4d81-9aac-4786bbaf40d1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+441234567890', "PhoneNumberConfirmed" = true WHERE "Id" = '967cb0fe-d734-4cde-b980-c7e3674211b2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ddf42cb7-d706-456b-8b4e-97c7a19ab244', '+441234567890', true, '2025-11-10 17:11:21', '2025-11-10 17:11:21', '967cb0fe-d734-4cde-b980-c7e3674211b2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01220962525', "PhoneNumberConfirmed" = true WHERE "Id" = 'ade65f66-a6a6-4b20-a3ab-f7b2b0357931';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b41ff788-a0c2-41d0-8d44-e5380570dac0', '01220962525', true, '2025-12-04 15:41:31', '2025-12-04 15:41:31', 'ade65f66-a6a6-4b20-a3ab-f7b2b0357931') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201554140308', "PhoneNumberConfirmed" = true WHERE "Id" = '1899e805-2414-4edd-84dc-2805520ec539';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f816db26-9e4f-49e6-9acf-30583a9062ef', '+201554140308', true, '2025-12-07 22:02:18', '2025-12-07 22:02:18', '1899e805-2414-4edd-84dc-2805520ec539') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01095275287', "PhoneNumberConfirmed" = true WHERE "Id" = 'b84e44be-a213-4669-9b39-1fbe5a9b6690';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6957d72c-df94-4567-8ba1-200f508ac408', '01095275287', true, '2025-12-15 12:06:36', '2025-12-15 12:06:36', 'b84e44be-a213-4669-9b39-1fbe5a9b6690') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201211350412', "PhoneNumberConfirmed" = true WHERE "Id" = 'acff059c-a725-4fe5-9c43-5020e07e30c2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c2937e2b-cace-48a3-9ea5-28278a78af7f', '+201211350412', true, '2025-12-16 20:15:47', '2025-12-16 20:15:47', 'acff059c-a725-4fe5-9c43-5020e07e30c2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066372860', "PhoneNumberConfirmed" = true WHERE "Id" = 'e803a63e-3fa9-4a41-a562-8129cae921fa';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7352884f-03c8-4d3a-bf87-cd255fe442ba', '+201066372860', true, '2025-12-21 09:54:26', '2025-12-21 09:54:26', 'e803a63e-3fa9-4a41-a562-8129cae921fa') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201013773704', "PhoneNumberConfirmed" = true WHERE "Id" = 'd893ef45-9f34-42bd-818c-83c5ae9bec0e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('43facc3f-b16e-4c3f-99b3-1faac95c0868', '+201013773704', true, '2025-12-18 18:52:00', '2025-12-18 18:52:00', 'd893ef45-9f34-42bd-818c-83c5ae9bec0e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201287799234', "PhoneNumberConfirmed" = true WHERE "Id" = '9a1c8775-614b-40b3-937b-e1aaca42f681';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a087cf92-f70d-49da-ad11-7981c02f578e', '+201287799234', true, '2025-12-29 15:55:54', '2025-12-29 15:55:54', '9a1c8775-614b-40b3-937b-e1aaca42f681') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201013329861', "PhoneNumberConfirmed" = true WHERE "Id" = '9bb70462-ae4b-43b2-a5d9-004460400c30';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('97a18944-e3d4-4d65-81f9-c78cbcb12d43', '+201013329861', true, '2025-12-28 20:43:22', '2025-12-28 20:43:22', '9bb70462-ae4b-43b2-a5d9-004460400c30') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201007219520', "PhoneNumberConfirmed" = true WHERE "Id" = '2294cb2d-8a8f-401c-8872-9baec16e71a5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b5e25b56-16e2-4a8a-99c4-816cb28b7d8b', '+201007219520', true, '2026-01-08 07:50:10', '2026-01-08 07:50:10', '2294cb2d-8a8f-401c-8872-9baec16e71a5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201205543363', "PhoneNumberConfirmed" = true WHERE "Id" = 'a5a0ea7a-bf4b-4da7-8c40-7cebb608ce97';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e8834de7-3875-42a6-8d7b-fd7ed53662ce', '+201205543363', true, '2026-01-09 20:01:46', '2026-01-09 20:01:46', 'a5a0ea7a-bf4b-4da7-8c40-7cebb608ce97') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060095786', "PhoneNumberConfirmed" = true WHERE "Id" = '0a9e0948-8d87-4657-8c70-48dfeec633aa';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('547b32bc-a0a2-40f7-a58f-ecf17d97ac4b', '+201060095786', true, '2025-12-31 14:56:05', '2025-12-31 14:56:05', '0a9e0948-8d87-4657-8c70-48dfeec633aa') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201018746745', "PhoneNumberConfirmed" = true WHERE "Id" = 'e5cf8d29-306a-4e00-bd93-a1fe984493ed';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7e3063d2-0fe9-45d3-8486-e2d217de8d32', '+201018746745', true, '2026-01-03 16:28:04', '2026-01-03 16:28:04', 'e5cf8d29-306a-4e00-bd93-a1fe984493ed') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201225156943', "PhoneNumberConfirmed" = true WHERE "Id" = '2a7dd130-c309-4a33-86cc-91122fa318b2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('884a6b8e-edff-4b78-8a76-a1b55dc3bbe6', '+201225156943', true, '2026-01-12 20:10:00', '2026-01-12 20:10:00', '2a7dd130-c309-4a33-86cc-91122fa318b2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001471498', "PhoneNumberConfirmed" = true WHERE "Id" = 'b7073f88-482b-4515-bf73-edd0588a596c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2cd23894-ae38-45d9-bc40-39f499b7edd2', '+201001471498', true, '2026-01-14 21:11:00', '2026-01-14 21:11:00', 'b7073f88-482b-4515-bf73-edd0588a596c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091505143', "PhoneNumberConfirmed" = true WHERE "Id" = 'daf8bb71-92a6-4840-bf8f-a3edc20f1a6d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ba9a6898-4986-454d-bcd4-4e31274a6aac', '+201091505143', true, '2026-01-11 01:49:33', '2026-01-11 01:49:33', 'daf8bb71-92a6-4840-bf8f-a3edc20f1a6d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201227909954', "PhoneNumberConfirmed" = true WHERE "Id" = '9e8f68ad-1243-4706-acb4-65960a7b69c9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('01c53118-e090-4100-a1e7-e16d39f4272e', '+201227909954', true, '2026-02-04 19:51:34', '2026-02-04 19:51:34', '9e8f68ad-1243-4706-acb4-65960a7b69c9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022323701', "PhoneNumberConfirmed" = true WHERE "Id" = 'cebd8652-891a-4f47-a0ab-8df2c297090a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8fb786fc-2bae-4799-95c2-33e948ecece2', '+201022323701', true, '2026-01-18 11:14:07', '2026-01-18 11:14:07', 'cebd8652-891a-4f47-a0ab-8df2c297090a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060611020', "PhoneNumberConfirmed" = true WHERE "Id" = '7b2b1915-0eff-40de-b19b-5e2177c82363';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bcf53722-9956-463b-8a01-6477c17138ec', '+201060611020', true, '2026-01-19 16:58:20', '2026-01-19 16:58:20', '7b2b1915-0eff-40de-b19b-5e2177c82363') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201226632562', "PhoneNumberConfirmed" = true WHERE "Id" = '6e269af8-7e86-4394-9c82-987d25bcc2b7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e71eba89-e7b7-4a94-9ae0-1c3d070b992c', '+201226632562', true, '2026-02-13 10:09:36', '2026-02-13 10:09:36', '6e269af8-7e86-4394-9c82-987d25bcc2b7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222222222', "PhoneNumberConfirmed" = true WHERE "Id" = '6b3eba3e-b844-4abd-9f72-39bf12dec16e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a65d3fbc-6cfa-411c-b0f5-47db1ab16ebe', '+201222222222', true, '2025-10-10 21:06:34', '2025-10-10 21:06:34', '6b3eba3e-b844-4abd-9f72-39bf12dec16e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201557720071', "PhoneNumberConfirmed" = true WHERE "Id" = 'ca1a7619-5811-490b-aad2-425fe00e18ff';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fe8c6f31-8894-40e1-8fd3-11b6164e44ae', '+201557720071', true, '2025-10-26 18:33:40', '2025-10-26 18:33:40', 'ca1a7619-5811-490b-aad2-425fe00e18ff') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003827569', "PhoneNumberConfirmed" = true WHERE "Id" = '14c1a066-9c3b-4829-bbe8-67af42c7cd0b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('24dda7b1-da3c-4ae4-82b6-ac8a6392b216', '+201003827569', true, '2025-11-29 21:46:06', '2025-11-29 21:46:06', '14c1a066-9c3b-4829-bbe8-67af42c7cd0b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000543060', "PhoneNumberConfirmed" = true WHERE "Id" = 'de73def6-fe25-461b-ae1f-6247b37d8ab0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dab7494d-e204-41c3-8f63-89b1667aed67', '+201000543060', true, '2025-11-11 23:35:07', '2025-11-11 23:35:07', 'de73def6-fe25-461b-ae1f-6247b37d8ab0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010018220', "PhoneNumberConfirmed" = true WHERE "Id" = 'f2537dfe-b74a-43a7-997e-cd29e5923c0b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('159e1d9e-9051-42e7-abef-01f0fab8f6a9', '+201010018220', true, '2025-12-18 22:58:24', '2025-12-18 22:58:24', 'f2537dfe-b74a-43a7-997e-cd29e5923c0b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201011199994', "PhoneNumberConfirmed" = true WHERE "Id" = '7cccf424-058c-4531-b6bd-614b7396c87f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('947ce2b2-7a00-446c-ac17-d1a10b9ef086', '+201011199994', true, '2026-01-03 18:35:57', '2026-01-03 18:35:57', '7cccf424-058c-4531-b6bd-614b7396c87f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201120145060', "PhoneNumberConfirmed" = true WHERE "Id" = 'bbe495ff-23d3-4c3a-9948-b5d9d8b14b3f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dd6aef2e-4133-4499-9709-319924d2ad50', '+201120145060', true, '2026-02-14 20:06:03', '2026-02-14 20:06:03', 'bbe495ff-23d3-4c3a-9948-b5d9d8b14b3f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201040050349', "PhoneNumberConfirmed" = true WHERE "Id" = '41168da3-01bc-4366-8b48-c4e0bc637321';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e51e447a-6155-430b-a6d5-36a077b75d4f', '+201040050349', true, '2025-12-20 15:55:46', '2025-12-20 15:55:46', '41168da3-01bc-4366-8b48-c4e0bc637321') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01283695771', "PhoneNumberConfirmed" = true WHERE "Id" = 'e1fdf112-f014-48bd-90f9-287fbc8f0a3f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9187097f-8878-4d41-8c3c-a078a4c39220', '01283695771', true, '2025-12-05 20:28:32', '2025-12-05 20:28:32', 'e1fdf112-f014-48bd-90f9-287fbc8f0a3f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201207117190', "PhoneNumberConfirmed" = true WHERE "Id" = 'f9d25314-dbef-442e-adff-5e5e5f0f0629';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fa265a42-91fa-4d09-b80b-d072ddc88327', '+201207117190', true, '2026-01-11 03:06:59', '2026-01-11 03:06:59', 'f9d25314-dbef-442e-adff-5e5e5f0f0629') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01274930911', "PhoneNumberConfirmed" = true WHERE "Id" = '5c73890f-5914-4d66-b632-ec314dfd94ba';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9487ecb4-a5b0-4ffe-9181-db341fb83aa5', '01274930911', true, '2025-12-29 17:38:58', '2025-12-29 17:38:58', '5c73890f-5914-4d66-b632-ec314dfd94ba') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201113133255', "PhoneNumberConfirmed" = true WHERE "Id" = 'a371553c-ac43-4ce2-8625-4e59349a015e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1176c178-6767-49d8-abd5-9866905df185', '+201113133255', true, '2025-12-21 10:06:24', '2025-12-21 10:06:24', 'a371553c-ac43-4ce2-8625-4e59349a015e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201558739998', "PhoneNumberConfirmed" = true WHERE "Id" = '2be7b471-1664-4ad2-9975-aa0a7ee3ed52';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cec96cb7-7fc7-44f5-be0d-f275e673e1ec', '+201558739998', true, '2026-01-08 08:47:47', '2026-01-08 08:47:47', '2be7b471-1664-4ad2-9975-aa0a7ee3ed52') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099990843', "PhoneNumberConfirmed" = true WHERE "Id" = '4a709701-d440-4938-9b5d-4c751e110549';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2022ac5c-9754-48e4-9acb-ae111b1c0306', '+201099990843', true, '2025-12-31 15:25:02', '2025-12-31 15:25:02', '4a709701-d440-4938-9b5d-4c751e110549') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201063385656', "PhoneNumberConfirmed" = true WHERE "Id" = '67f0765c-f118-4ed4-85b5-7a4e142e73bf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('82f67394-1dca-4981-ac2d-3f71c8ee7b37', '+201063385656', true, '2025-12-12 15:12:21', '2025-12-12 15:12:21', '67f0765c-f118-4ed4-85b5-7a4e142e73bf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201277503670', "PhoneNumberConfirmed" = true WHERE "Id" = '3b590e99-9375-4621-9c2d-a287f0d035c2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3e51e989-4d82-4544-ba0f-5a86fc05437f', '+201277503670', true, '2026-01-09 20:27:18', '2026-01-09 20:27:18', '3b590e99-9375-4621-9c2d-a287f0d035c2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201029484469', "PhoneNumberConfirmed" = true WHERE "Id" = '5f970fe1-bed7-47ec-85ad-d96ad6a4b19f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('19cd7e05-42b3-418e-a836-0d357c484947', '+201029484469', true, '2026-01-15 00:04:30', '2026-01-15 00:04:30', '5f970fe1-bed7-47ec-85ad-d96ad6a4b19f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201220960823', "PhoneNumberConfirmed" = true WHERE "Id" = '506467ee-0595-441d-8f45-58742dadc20f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a5b2dc90-5d1d-4f1c-8bdc-f92e3c141941', '+201220960823', true, '2026-02-12 17:28:50', '2026-02-12 17:28:50', '506467ee-0595-441d-8f45-58742dadc20f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201063816449', "PhoneNumberConfirmed" = true WHERE "Id" = '8e51aadf-c186-4f13-9185-8799e412364e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('de1bfa38-3e06-4b4d-aed5-92fce3083079', '+201063816449', true, '2026-01-19 21:25:11', '2026-01-19 21:25:11', '8e51aadf-c186-4f13-9185-8799e412364e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201201069228', "PhoneNumberConfirmed" = true WHERE "Id" = '2ea5ac2c-98d1-4d44-be31-0d8ce589fc1c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6a353dab-721c-41d7-983d-0f1d431ab59b', '+201201069228', true, '2026-02-14 22:22:25', '2026-02-14 22:22:25', '2ea5ac2c-98d1-4d44-be31-0d8ce589fc1c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201024059955', "PhoneNumberConfirmed" = true WHERE "Id" = '47021bb7-b710-4ec6-af10-3b293d24c00e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('03c32db3-4893-4960-a1e2-8cc743cbb5b8', '+201024059955', true, '2025-09-16 15:02:48', '2025-09-16 15:02:48', '47021bb7-b710-4ec6-af10-3b293d24c00e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201288612376', "PhoneNumberConfirmed" = true WHERE "Id" = '61b2117e-766a-4eca-b3d1-b7151aa9357c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('82beb143-b207-42b8-97c1-30bafeaab8b0', '+201288612376', true, '2025-11-09 21:40:09', '2025-11-09 21:40:09', '61b2117e-766a-4eca-b3d1-b7151aa9357c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222503149', "PhoneNumberConfirmed" = true WHERE "Id" = 'ab786e4d-527a-4caf-b51c-b59a8461f150';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cee8ed1a-c8b4-41f2-8d74-42d2b6d965f5', '+201222503149', true, '2025-11-30 10:45:14', '2025-11-30 10:45:14', 'ab786e4d-527a-4caf-b51c-b59a8461f150') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201282820100', "PhoneNumberConfirmed" = true WHERE "Id" = 'ed31c35e-9c20-483a-a7a3-51ecd357add9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6e1fdb06-4342-4b3c-b668-d103424dbda7', '+201282820100', true, '2025-11-13 15:47:06', '2025-11-13 15:47:06', 'ed31c35e-9c20-483a-a7a3-51ecd357add9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201107418921', "PhoneNumberConfirmed" = true WHERE "Id" = '66afe224-45d7-4f90-8478-f3391ffdf96f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cafbba27-e7ef-40ea-ab25-a0d1f0fc7932', '+201107418921', true, '2025-11-10 17:48:05', '2025-11-10 17:48:05', '66afe224-45d7-4f90-8478-f3391ffdf96f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01272084670', "PhoneNumberConfirmed" = true WHERE "Id" = 'efeac197-a1ff-49dc-954c-1f0674262395';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('78aace90-20d8-4e2d-a2f3-e1d85281bab6', '01272084670', true, '2025-12-15 14:27:11', '2025-12-15 14:27:11', 'efeac197-a1ff-49dc-954c-1f0674262395') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201115074133', "PhoneNumberConfirmed" = true WHERE "Id" = '6e6b5266-a146-4713-87a4-e987a096ece0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5e45da8b-2d4f-4de6-8ddd-332c13f0d2fd', '+201115074133', true, '2025-12-18 23:48:59', '2025-12-18 23:48:59', '6e6b5266-a146-4713-87a4-e987a096ece0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092675243', "PhoneNumberConfirmed" = true WHERE "Id" = '5bfb367c-1588-46ae-a365-ea216c4f0430';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('faadbb10-ac01-46c4-beba-be864b542619', '+201092675243', true, '2025-12-17 07:38:33', '2025-12-17 07:38:33', '5bfb367c-1588-46ae-a365-ea216c4f0430') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201125661873', "PhoneNumberConfirmed" = true WHERE "Id" = '0b7d7256-d659-4fe0-9425-b8d15f82236a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('39f32037-0e38-4ded-b687-87435d14f939', '+201125661873', true, '2025-12-20 17:41:33', '2025-12-20 17:41:33', '0b7d7256-d659-4fe0-9425-b8d15f82236a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201124241428', "PhoneNumberConfirmed" = true WHERE "Id" = '967fcb05-36fd-4725-a3b4-f6a00e00372f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('49557559-630a-4cd4-9e3c-44e8563f1552', '+201124241428', true, '2025-12-21 11:08:18', '2025-12-21 11:08:18', '967fcb05-36fd-4725-a3b4-f6a00e00372f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201287817552', "PhoneNumberConfirmed" = true WHERE "Id" = '7bd37adc-0bbb-4596-90c6-90ae5bf0ae98';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5e093dfe-89c1-4410-aff5-b4155815ac76', '+201287817552', true, '2025-12-29 00:26:47', '2025-12-29 00:26:47', '7bd37adc-0bbb-4596-90c6-90ae5bf0ae98') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201127517527', "PhoneNumberConfirmed" = true WHERE "Id" = 'e8eafb81-2601-41ea-8a9f-177e70f58093';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1ba1db52-0fa3-426f-9100-6a9ac9fea0bc', '+201127517527', true, '2026-01-03 21:51:11', '2026-01-03 21:51:11', 'e8eafb81-2601-41ea-8a9f-177e70f58093') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01285217221', "PhoneNumberConfirmed" = true WHERE "Id" = '04459049-0d99-48d4-bfac-34db1b0dfde7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('857a947e-8e14-47d5-b85f-840bc753b784', '01285217221', true, '2026-01-11 04:17:33', '2026-01-11 04:17:33', '04459049-0d99-48d4-bfac-34db1b0dfde7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201124168057', "PhoneNumberConfirmed" = true WHERE "Id" = '54359c3d-da8c-4589-82a0-b05880536544';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('809197fd-ed4d-480d-978d-01339ae9eeee', '+201124168057', true, '2026-01-09 20:43:58', '2026-01-09 20:43:58', '54359c3d-da8c-4589-82a0-b05880536544') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201235269874', "PhoneNumberConfirmed" = true WHERE "Id" = 'dc005a02-05d1-43de-bb21-ae3a75c62380';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('12e6772a-9331-4c4c-94cc-afc534910cc1', '+201235269874', true, '2026-01-16 23:01:47', '2026-01-16 23:01:47', 'dc005a02-05d1-43de-bb21-ae3a75c62380') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201144639152', "PhoneNumberConfirmed" = true WHERE "Id" = '52594c07-5521-482a-a138-13aafcbe634d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('28d9fe3e-322a-43d4-a090-a9d10ea61cb5', '+201144639152', true, '2026-02-04 22:49:34', '2026-02-04 22:49:34', '52594c07-5521-482a-a138-13aafcbe634d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201027784371', "PhoneNumberConfirmed" = true WHERE "Id" = '8ce7d773-b8cc-4c99-a1aa-c3f8a5ec409f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ce8a645b-0e84-4346-b23e-4468e7fbf34b', '+201027784371', true, '2026-04-12 06:12:00', '2026-04-12 06:12:00', '8ce7d773-b8cc-4c99-a1aa-c3f8a5ec409f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000135406', "PhoneNumberConfirmed" = true WHERE "Id" = '090f6a12-df6d-4c5a-9296-62ab3180d219';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('58e5119f-d13b-4ec0-898a-92beb20b7a0e', '+201000135406', true, '2026-01-18 11:23:45', '2026-01-18 11:23:45', '090f6a12-df6d-4c5a-9296-62ab3180d219') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201024081921', "PhoneNumberConfirmed" = true WHERE "Id" = '1f88a302-901c-4947-8b53-07703a950e07';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('44b7f10b-de6d-4d92-88a9-4cae1abc425e', '+201024081921', true, '2025-10-08 00:02:49', '2025-10-08 00:02:49', '1f88a302-901c-4947-8b53-07703a950e07') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+93584715155', "PhoneNumberConfirmed" = true WHERE "Id" = '18a185eb-c7bf-4d88-b361-80cbeb7e7c63';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('66b83514-66f4-421d-9153-78cd3fd7e942', '+93584715155', true, '2025-11-10 18:58:14', '2025-11-10 18:58:14', '18a185eb-c7bf-4d88-b361-80cbeb7e7c63') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201515853615', "PhoneNumberConfirmed" = true WHERE "Id" = '94591165-fcd6-42b8-b23a-9c254f8b5331';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8b6b2b93-e78d-4994-9ca2-cbaaa6bcd739', '+201515853615', true, '2025-11-10 00:25:38', '2025-11-10 00:25:38', '94591165-fcd6-42b8-b23a-9c254f8b5331') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201225901152', "PhoneNumberConfirmed" = true WHERE "Id" = '1187bbde-ed7d-403a-9c48-f815c7add29b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4790e033-bd0f-448d-81bf-f74fc5ff0213', '+201225901152', true, '2025-11-11 23:57:47', '2025-11-11 23:57:47', '1187bbde-ed7d-403a-9c48-f815c7add29b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01080380469', "PhoneNumberConfirmed" = true WHERE "Id" = '3d8ecad9-2f4d-4862-ba5d-72e9524f80bc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('266dcf24-be67-4db0-b4c0-8e2173393368', '01080380469', true, '2025-12-14 11:15:36', '2025-12-14 11:15:36', '3d8ecad9-2f4d-4862-ba5d-72e9524f80bc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201555543768', "PhoneNumberConfirmed" = true WHERE "Id" = '460643dd-5775-49ff-a6db-a3168b8008b9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2fc1c457-5a6c-4988-83d9-0dcd78b34ff0', '+201555543768', true, '2026-04-28 16:28:45', '2026-04-28 16:28:45', '460643dd-5775-49ff-a6db-a3168b8008b9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092619579', "PhoneNumberConfirmed" = true WHERE "Id" = 'd469feeb-ea21-44e2-82f1-e6e55d49fae6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('25739771-8e48-4490-b9ff-9d41490ae70e', '+201092619579', true, '2025-12-05 21:01:17', '2025-12-05 21:01:17', 'd469feeb-ea21-44e2-82f1-e6e55d49fae6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098974034', "PhoneNumberConfirmed" = true WHERE "Id" = 'bdad46b3-9ddc-41a1-bca2-15eb42d4abc8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4a2fc002-00b7-4048-97ac-d9cde14e3a87', '+201098974034', true, '2025-12-20 18:43:09', '2025-12-20 18:43:09', 'bdad46b3-9ddc-41a1-bca2-15eb42d4abc8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229806966', "PhoneNumberConfirmed" = true WHERE "Id" = '6355062c-e356-4ed1-a011-768329f9b228';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('59d0690b-e2d6-4e58-aaf2-6e78cfb8493e', '+201229806966', true, '2026-01-04 00:17:05', '2026-01-04 00:17:05', '6355062c-e356-4ed1-a011-768329f9b228') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201274926400', "PhoneNumberConfirmed" = true WHERE "Id" = '73175db0-4a78-4ba8-b5af-74904eac1ab9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('08570538-23dd-4635-b9b0-eb11c1a28172', '+201274926400', true, '2025-12-21 11:39:15', '2025-12-21 11:39:15', '73175db0-4a78-4ba8-b5af-74904eac1ab9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01228442381', "PhoneNumberConfirmed" = true WHERE "Id" = 'e53de4da-fcf9-4673-9247-387860b94b29';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('38763950-ec8c-49d6-9cab-82506044f948', '01228442381', true, '2025-12-15 15:10:26', '2025-12-15 15:10:26', 'e53de4da-fcf9-4673-9247-387860b94b29') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201111223895', "PhoneNumberConfirmed" = true WHERE "Id" = '7ac0a13c-df2f-4613-a6ff-993fbaa80f26';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d74bb8e3-2d92-4862-8ac6-d9e376361271', '+201111223895', true, '2026-01-08 09:09:45', '2026-01-08 09:09:45', '7ac0a13c-df2f-4613-a6ff-993fbaa80f26') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201069195075', "PhoneNumberConfirmed" = true WHERE "Id" = '0502ffe9-7179-4b27-b57d-f44095cc6253';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('57c68a09-bf59-47fc-a03b-350365bffd82', '+201069195075', true, '2026-01-17 00:44:38', '2026-01-17 00:44:38', '0502ffe9-7179-4b27-b57d-f44095cc6253') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066940404', "PhoneNumberConfirmed" = true WHERE "Id" = '41875156-251c-4b2b-b098-50da85e3ec31';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('eadf2827-3822-4f6b-8ffc-f4dfaa930046', '+201066940404', true, '2026-01-09 21:00:23', '2026-01-09 21:00:23', '41875156-251c-4b2b-b098-50da85e3ec31') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064940115', "PhoneNumberConfirmed" = true WHERE "Id" = '85c26992-053f-47b8-9ebd-d99c3c188405';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0d5b7b32-8e1d-496e-b5c2-4b4e2a0128a8', '+201064940115', true, '2025-12-29 18:08:00', '2025-12-29 18:08:00', '85c26992-053f-47b8-9ebd-d99c3c188405') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064766622', "PhoneNumberConfirmed" = true WHERE "Id" = '8c9f39b7-5ed7-4cb2-9850-44cf2602d567';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('41b2ae33-19b4-42a2-9c1a-0b891f1d4dbb', '+201064766622', true, '2025-12-31 15:49:37', '2025-12-31 15:49:37', '8c9f39b7-5ed7-4cb2-9850-44cf2602d567') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201551782811', "PhoneNumberConfirmed" = true WHERE "Id" = 'dc27e8e9-eddb-43ce-9ef8-3a090a7c15cf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e9aa7915-791f-4606-8238-c10f4b73cd40', '+201551782811', true, '2026-01-11 04:49:00', '2026-01-11 04:49:00', 'dc27e8e9-eddb-43ce-9ef8-3a090a7c15cf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+81654213524', "PhoneNumberConfirmed" = true WHERE "Id" = '85154d36-fb46-4258-baa8-dc69d68255ca';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8d66572a-a3a4-4c04-99f4-f93385068d77', '+81654213524', true, '2026-01-15 11:04:38', '2026-01-15 11:04:38', '85154d36-fb46-4258-baa8-dc69d68255ca') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201017176392', "PhoneNumberConfirmed" = true WHERE "Id" = '3d858acd-bd1b-4df6-874f-245d851cb565';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('05b20d44-7946-483e-9c09-e5b1596bbe86', '+201017176392', true, '2026-01-18 11:25:55', '2026-01-18 11:25:55', '3d858acd-bd1b-4df6-874f-245d851cb565') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01101840347', "PhoneNumberConfirmed" = true WHERE "Id" = '8a8cf992-0401-48dc-b0e0-cad7b22a07de';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('578d7818-fb18-4149-bb24-f0018e27fed5', '01101840347', true, '2025-12-16 21:07:15', '2025-12-16 21:07:15', '8a8cf992-0401-48dc-b0e0-cad7b22a07de') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201221280468', "PhoneNumberConfirmed" = true WHERE "Id" = '02ee01fd-782e-4843-b53f-ae9956cd9472';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4d62ca15-630c-4b06-92a1-762ca1b80fce', '+201221280468', true, '2026-02-05 12:01:55', '2026-02-05 12:01:55', '02ee01fd-782e-4843-b53f-ae9956cd9472') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201149145531', "PhoneNumberConfirmed" = true WHERE "Id" = '361d6121-b81c-4532-9baf-d55a6fbbb691';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3aa9c5bc-3cea-41b3-bf8e-9eb278514db7', '+201149145531', true, '2025-11-10 00:44:01', '2025-11-10 00:44:01', '361d6121-b81c-4532-9baf-d55a6fbbb691') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201282246312', "PhoneNumberConfirmed" = true WHERE "Id" = 'cec6a835-a4a3-4bcb-a72d-4e128c49e2fc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ec85cefa-ad6c-4f16-9eab-fbc36f8b255d', '+201282246312', true, '2025-11-10 19:21:24', '2025-11-10 19:21:24', 'cec6a835-a4a3-4bcb-a72d-4e128c49e2fc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201014701284', "PhoneNumberConfirmed" = true WHERE "Id" = '445ef624-b62e-4d02-8b29-c5fda6ae9043';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2b42157c-8c36-4332-865f-4235c01943d2', '+201014701284', true, '2025-11-12 00:56:06', '2025-11-12 00:56:06', '445ef624-b62e-4d02-8b29-c5fda6ae9043') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201282152008', "PhoneNumberConfirmed" = true WHERE "Id" = '057ceee0-ec07-4ed8-81fd-e44fbe48f13e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('264d1025-ca15-4011-beee-67f355c64aeb', '+201282152008', true, '2025-11-13 17:46:28', '2025-11-13 17:46:28', '057ceee0-ec07-4ed8-81fd-e44fbe48f13e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01140060009', "PhoneNumberConfirmed" = true WHERE "Id" = '9f38485e-ae86-4155-ab77-c85b0dab30ef';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('49edcacd-fc7b-4f68-b00d-21078298145f', '01140060009', true, '2025-12-16 22:35:21', '2025-12-16 22:35:21', '9f38485e-ae86-4155-ab77-c85b0dab30ef') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '0106 307 3934', "PhoneNumberConfirmed" = true WHERE "Id" = 'ad7eddc9-83b5-41d3-a57e-63858182e0f5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3f0c3abe-2ecb-42ef-a8c1-cb5a010168ae', '0106 307 3934', true, '2025-11-30 13:00:20', '2025-11-30 13:00:20', 'ad7eddc9-83b5-41d3-a57e-63858182e0f5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201203985003', "PhoneNumberConfirmed" = true WHERE "Id" = '7512cdd0-9789-45c6-8a3a-b52b91aadf98';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a1d0f115-13ed-4f75-bedd-d92e64ed0175', '+201203985003', true, '2025-12-14 12:30:41', '2025-12-14 12:30:41', '7512cdd0-9789-45c6-8a3a-b52b91aadf98') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099643443', "PhoneNumberConfirmed" = true WHERE "Id" = '6034a64f-7c42-4252-b5f0-2919c706ec55';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('da4d8dce-4ec3-426b-a009-40b5daeb828e', '+201099643443', true, '2025-12-19 01:03:46', '2025-12-19 01:03:46', '6034a64f-7c42-4252-b5f0-2919c706ec55') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201227686977', "PhoneNumberConfirmed" = true WHERE "Id" = 'd8992755-9de7-473b-bfcd-650751d963fe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('99244aa9-9fad-423c-9c72-a39e1b561c54', '+201227686977', true, '2025-12-15 16:36:50', '2025-12-15 16:36:50', 'd8992755-9de7-473b-bfcd-650751d963fe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201065124610', "PhoneNumberConfirmed" = true WHERE "Id" = '7946bcea-9127-4169-a333-97dd5acce0ee';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('168fca1d-0a52-4281-ba95-b72388d4aae5', '+201065124610', true, '2025-12-29 06:27:43', '2025-12-29 06:27:43', '7946bcea-9127-4169-a333-97dd5acce0ee') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201017000043', "PhoneNumberConfirmed" = true WHERE "Id" = 'fb50ee3a-2063-4bad-b6a7-cdf95be9f9e3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('df2871f2-d764-4a5b-8c22-f880157c119f', '+201017000043', true, '2026-01-08 10:03:48', '2026-01-08 10:03:48', 'fb50ee3a-2063-4bad-b6a7-cdf95be9f9e3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004329552', "PhoneNumberConfirmed" = true WHERE "Id" = '83eee90e-7cbb-4857-b3b5-1ff7096542aa';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9d466a93-007e-4c72-94b1-6a41c525565d', '+201004329552', true, '2026-01-09 21:37:50', '2026-01-09 21:37:50', '83eee90e-7cbb-4857-b3b5-1ff7096542aa') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064762737', "PhoneNumberConfirmed" = true WHERE "Id" = 'b08250c2-4210-4c2e-a22f-5065d64161bf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ad6ea280-e809-4038-a2e3-e2ece75f06dc', '+201064762737', true, '2026-04-11 12:27:20', '2026-04-11 12:27:20', 'b08250c2-4210-4c2e-a22f-5065d64161bf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021010225', "PhoneNumberConfirmed" = true WHERE "Id" = 'b380eea5-ddaa-4aa9-9dcc-2d1d1bd9cab7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('530dd13c-2b86-4158-9336-9e506a03e7b5', '+201021010225', true, '2025-12-31 15:49:21', '2025-12-31 15:49:21', 'b380eea5-ddaa-4aa9-9dcc-2d1d1bd9cab7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201270043671', "PhoneNumberConfirmed" = true WHERE "Id" = '52f6f874-d93b-4d71-aff0-af0a658fcd19';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d5a51738-0a95-4f55-855a-a426a40d0b8c', '+201270043671', true, '2026-01-11 04:43:35', '2026-01-11 04:43:35', '52f6f874-d93b-4d71-aff0-af0a658fcd19') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229806967', "PhoneNumberConfirmed" = true WHERE "Id" = '77b7c59f-7f40-4a5c-b943-63fa44e5a87e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b74ca9b0-9741-4550-bc4d-46b9a72db917', '+201229806967', true, '2026-01-04 00:23:39', '2026-01-04 00:23:39', '77b7c59f-7f40-4a5c-b943-63fa44e5a87e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201008098388', "PhoneNumberConfirmed" = true WHERE "Id" = 'fec74170-d6ed-41b4-a40c-2cc9a9381aae';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('07e39e3b-d2d4-4b5e-b68b-70fe96b53d63', '+201008098388', true, '2026-01-13 04:21:50', '2026-01-13 04:21:50', 'fec74170-d6ed-41b4-a40c-2cc9a9381aae') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002658506', "PhoneNumberConfirmed" = true WHERE "Id" = '41a4af47-da6d-4648-81f9-78aa2a396d3c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('292e2e91-53a6-4cf5-82a8-83b9b00f7330', '+201002658506', true, '2026-01-17 01:08:49', '2026-01-17 01:08:49', '41a4af47-da6d-4648-81f9-78aa2a396d3c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201129306794', "PhoneNumberConfirmed" = true WHERE "Id" = 'c30c9dfa-6fbf-4eff-8a2a-00dfb5330260';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('18ec911e-69d4-4278-88ac-7caaab16f899', '+201129306794', true, '2026-01-18 15:04:06', '2026-01-18 15:04:06', 'c30c9dfa-6fbf-4eff-8a2a-00dfb5330260') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201553281565', "PhoneNumberConfirmed" = true WHERE "Id" = 'c508fea3-d567-43f0-8133-008b22939779';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ccfd3b26-b763-410e-801e-8ff832602f77', '+201553281565', true, '2026-01-21 07:51:39', '2026-01-21 07:51:39', 'c508fea3-d567-43f0-8133-008b22939779') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01068432839', "PhoneNumberConfirmed" = true WHERE "Id" = '33c37405-4285-4859-a96f-2dea98964ef9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7fdb4fe1-97d4-425e-ab98-f4e41c05a0c2', '01068432839', true, '2026-04-08 00:53:22', '2026-04-08 00:53:22', '33c37405-4285-4859-a96f-2dea98964ef9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201507464997', "PhoneNumberConfirmed" = true WHERE "Id" = '172fbd17-0d65-4fa9-9c54-2d4d0f4d0421';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3e1a869b-f3c9-4bfe-9af5-f66a35e939dd', '+201507464997', true, '2026-02-03 21:48:02', '2026-02-03 21:48:02', '172fbd17-0d65-4fa9-9c54-2d4d0f4d0421') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201127000427', "PhoneNumberConfirmed" = true WHERE "Id" = '93a65ea0-2070-4854-80a0-7f03c5aed792';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('962392ad-48f4-4e7c-a5d7-6e1d0f99f9c8', '+201127000427', true, '2026-02-06 15:44:57', '2026-02-06 15:44:57', '93a65ea0-2070-4854-80a0-7f03c5aed792') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222801076', "PhoneNumberConfirmed" = true WHERE "Id" = '03a4712e-339d-47e0-8244-980283e1fb20';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ad61ef5e-fbd9-4afa-a797-74bf003dcd22', '+201222801076', true, '2025-11-10 02:25:17', '2025-11-10 02:25:17', '03a4712e-339d-47e0-8244-980283e1fb20') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201277334366', "PhoneNumberConfirmed" = true WHERE "Id" = '8e1e2bee-9f79-41ea-b964-10e9a428e181';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a0a0b040-8768-4dd1-8170-bef314998ce3', '+201277334366', true, '2025-11-13 18:24:24', '2025-11-13 18:24:24', '8e1e2bee-9f79-41ea-b964-10e9a428e181') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201202745055', "PhoneNumberConfirmed" = true WHERE "Id" = '41a1669b-0541-4026-b534-4e1c91c63fc3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1b12a117-5149-46d7-bc7f-acda05e0c1e2', '+201202745055', true, '2025-11-10 21:06:00', '2025-11-10 21:06:00', '41a1669b-0541-4026-b534-4e1c91c63fc3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201129048370', "PhoneNumberConfirmed" = true WHERE "Id" = '7b23311b-15c7-415e-8b61-f3c691a94905';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cff5739c-7f48-47e3-b640-a8db30c23c99', '+201129048370', true, '2025-12-15 22:14:07', '2025-12-15 22:14:07', '7b23311b-15c7-415e-8b61-f3c691a94905') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01203665537', "PhoneNumberConfirmed" = true WHERE "Id" = '642eeec9-18d6-4bf8-ba59-c8c613ebcdfd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ab125892-0032-4255-a84f-198de433d6e5', '01203665537', true, '2025-12-14 14:15:36', '2025-12-14 14:15:36', '642eeec9-18d6-4bf8-ba59-c8c613ebcdfd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222726338', "PhoneNumberConfirmed" = true WHERE "Id" = '543dcbc1-9ca4-45ed-86b6-843bc1e151a3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8bb9bebd-e7cd-475c-aa74-9f349952d070', '+201222726338', true, '2025-12-29 22:17:00', '2025-12-29 22:17:00', '543dcbc1-9ca4-45ed-86b6-843bc1e151a3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201274639755', "PhoneNumberConfirmed" = true WHERE "Id" = 'c7a0a51d-86d2-46d6-8f98-6263b1ed7cb4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('502a049c-5e47-4306-bf56-3c3d42119b50', '+201274639755', true, '2025-12-19 01:14:27', '2025-12-19 01:14:27', 'c7a0a51d-86d2-46d6-8f98-6263b1ed7cb4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01202905552', "PhoneNumberConfirmed" = true WHERE "Id" = 'a5ad97aa-4c0e-4349-a259-8dcbe62aee57';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4f32d0c1-a4ff-42c6-a930-dfea99558ebe', '01202905552', true, '2025-12-17 10:20:33', '2025-12-17 10:20:33', 'a5ad97aa-4c0e-4349-a259-8dcbe62aee57') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099999843', "PhoneNumberConfirmed" = true WHERE "Id" = 'c3761f56-4d74-48b6-a9ed-0947c2d61134';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6a7755f0-39c7-459b-9ac3-2b095a4ddad5', '+201099999843', true, '2025-12-31 16:17:08', '2025-12-31 16:17:08', 'c3761f56-4d74-48b6-a9ed-0947c2d61134') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201285557467', "PhoneNumberConfirmed" = true WHERE "Id" = '93c59b9d-0ed0-4a5f-93a6-73c92dab15df';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('47a089cf-ec12-4a6d-9f43-85f8c5c57e1f', '+201285557467', true, '2025-12-21 14:29:27', '2025-12-21 14:29:27', '93c59b9d-0ed0-4a5f-93a6-73c92dab15df') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201150415289', "PhoneNumberConfirmed" = true WHERE "Id" = '71c33df7-3352-4f77-b721-262afb8a3226';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4876f323-ea77-4a99-b7f6-36f7757d3183', '+201150415289', true, '2026-04-30 20:45:09', '2026-04-30 20:45:09', '71c33df7-3352-4f77-b721-262afb8a3226') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201142309763', "PhoneNumberConfirmed" = true WHERE "Id" = '94964b7a-d812-46f0-bed2-20f49c769f3f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2ab9711e-7659-472b-9f5e-af956514f5db', '+201142309763', true, '2025-12-29 06:28:03', '2025-12-29 06:28:03', '94964b7a-d812-46f0-bed2-20f49c769f3f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201270105913', "PhoneNumberConfirmed" = true WHERE "Id" = '28f1dd74-3545-4037-a88e-1bb3a42b47be';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('50681031-b897-4de7-ae6a-b6d6267fa418', '+201270105913', true, '2026-05-01 09:59:46', '2026-05-01 09:59:46', '28f1dd74-3545-4037-a88e-1bb3a42b47be') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050964269', "PhoneNumberConfirmed" = true WHERE "Id" = '820cd2e9-4708-4531-910c-d66fd5a770ba';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('10534d10-e065-4b17-95cf-71ad9e7d7798', '+201050964269', true, '2026-01-21 09:52:54', '2026-01-21 09:52:54', '820cd2e9-4708-4531-910c-d66fd5a770ba') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201203772973', "PhoneNumberConfirmed" = true WHERE "Id" = 'c36049e0-af05-4da3-9c53-f76aa227be6f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9566713b-5460-4543-8e37-d5995e016dc1', '+201203772973', true, '2026-01-09 22:07:09', '2026-01-09 22:07:09', 'c36049e0-af05-4da3-9c53-f76aa227be6f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201101329749', "PhoneNumberConfirmed" = true WHERE "Id" = '89d03759-df0f-43e0-a224-dbd808489549';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9ca7a0ea-a6d1-480d-a41c-815d4dd3a496', '+201101329749', true, '2026-01-04 06:59:04', '2026-01-04 06:59:04', '89d03759-df0f-43e0-a224-dbd808489549') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092495884', "PhoneNumberConfirmed" = true WHERE "Id" = '2e24954f-d0bf-401d-a4ab-d356a4f1617d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('53e36b65-0f64-46ac-a459-c694ef3f4a24', '+201092495884', true, '2026-02-05 16:26:05', '2026-02-05 16:26:05', '2e24954f-d0bf-401d-a4ab-d356a4f1617d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+971568737746', "PhoneNumberConfirmed" = true WHERE "Id" = '4d477ea4-7977-4491-a3c9-7aa274dd8414';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6c423033-96d8-436b-b229-484f76a13be8', '+971568737746', true, '2026-01-13 06:26:05', '2026-01-13 06:26:05', '4d477ea4-7977-4491-a3c9-7aa274dd8414') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201149478735', "PhoneNumberConfirmed" = true WHERE "Id" = 'cf9d6ed7-0e4d-4e45-bd48-c93d5f16043d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1c9d8e47-6804-4bef-b86e-f058c27a01d7', '+201149478735', true, '2026-02-04 23:34:15', '2026-02-04 23:34:15', 'cf9d6ed7-0e4d-4e45-bd48-c93d5f16043d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201144717950', "PhoneNumberConfirmed" = true WHERE "Id" = '3be7dfb6-5672-46a7-9818-5fadc455edd2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('50f11a4f-3a19-4b53-a92e-be0344fae908', '+201144717950', true, '2026-02-12 17:38:47', '2026-02-12 17:38:47', '3be7dfb6-5672-46a7-9818-5fadc455edd2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022331542', "PhoneNumberConfirmed" = true WHERE "Id" = '51295931-112a-4b78-895d-c6d0cc10b9d4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('38df7a2f-d344-4496-b3b5-54d65cc6db46', '+201022331542', true, '2026-04-08 12:22:14', '2026-04-08 12:22:14', '51295931-112a-4b78-895d-c6d0cc10b9d4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201244536635', "PhoneNumberConfirmed" = true WHERE "Id" = 'f96a40b0-d29b-4953-b009-a698dc968bbf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1b649778-3d0b-4096-a720-8be768f35487', '+201244536635', true, '2026-02-15 23:44:49', '2026-02-15 23:44:49', 'f96a40b0-d29b-4953-b009-a698dc968bbf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000228346', "PhoneNumberConfirmed" = true WHERE "Id" = '49614dd5-b115-4d05-b815-99b3f1192970';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('07273a6a-ba2a-4f58-905e-afe3491e8e96', '+201000228346', true, '2025-11-13 18:35:56', '2025-11-13 18:35:56', '49614dd5-b115-4d05-b815-99b3f1192970') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201014403914', "PhoneNumberConfirmed" = true WHERE "Id" = 'a958e37f-5bbb-42b7-b3d7-a6b7ea5568ca';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ea9b1a56-924e-4e4d-b282-6874fa7167b1', '+201014403914', true, '2025-11-10 05:28:31', '2025-11-10 05:28:31', 'a958e37f-5bbb-42b7-b3d7-a6b7ea5568ca') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01023710326', "PhoneNumberConfirmed" = true WHERE "Id" = '0063ac06-ec1e-4435-9463-7813f845ec96';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a093b663-e156-4a47-9f1a-b2c0336a8747', '01023710326', true, '2025-11-30 21:49:13', '2025-11-30 21:49:13', '0063ac06-ec1e-4435-9463-7813f845ec96') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201125607088', "PhoneNumberConfirmed" = true WHERE "Id" = '3280dead-6814-472f-9588-2c53d5ea988a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c24b550e-d354-465f-896a-edddb37d8ef0', '+201125607088', true, '2025-12-15 22:40:42', '2025-12-15 22:40:42', '3280dead-6814-472f-9588-2c53d5ea988a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01005628711', "PhoneNumberConfirmed" = true WHERE "Id" = '185bf78d-8137-4e81-b2ed-52acf4462af7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f1dbea9c-76a0-432c-a17d-c8134d9aadd3', '01005628711', true, '2025-12-06 04:53:08', '2025-12-06 04:53:08', '185bf78d-8137-4e81-b2ed-52acf4462af7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01270008131', "PhoneNumberConfirmed" = true WHERE "Id" = 'fc198392-4aee-499d-8347-cb8400c4322a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('060bbb7d-e7b9-4cce-8c63-908038bbd2a0', '01270008131', true, '2025-12-17 10:44:13', '2025-12-17 10:44:13', 'fc198392-4aee-499d-8347-cb8400c4322a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01558351603', "PhoneNumberConfirmed" = true WHERE "Id" = '74e42738-8c3f-4817-99e7-6a5657f75993';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('089a263c-4aff-4985-b44e-2c1d8b1e8451', '01558351603', true, '2025-12-14 14:56:29', '2025-12-14 14:56:29', '74e42738-8c3f-4817-99e7-6a5657f75993') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201080396464', "PhoneNumberConfirmed" = true WHERE "Id" = 'aa64ba82-3036-4e44-ac5f-f86e86a9f144';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c54db00e-e312-4ed1-b1ec-2574904d96a6', '+201080396464', true, '2025-12-29 22:36:45', '2025-12-29 22:36:45', 'aa64ba82-3036-4e44-ac5f-f86e86a9f144') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201149414617', "PhoneNumberConfirmed" = true WHERE "Id" = 'e394154f-4bf7-44b7-acf2-480737829c22';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0c39fe66-64d5-4fe4-aed0-e874b737b640', '+201149414617', true, '2025-12-21 18:28:12', '2025-12-21 18:28:12', 'e394154f-4bf7-44b7-acf2-480737829c22') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201129299746', "PhoneNumberConfirmed" = true WHERE "Id" = '440897f6-496f-4418-ac8a-09d29ca379b9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2a7e9234-0537-49f4-b478-81a8f939ab84', '+201129299746', true, '2025-12-31 16:38:42', '2025-12-31 16:38:42', '440897f6-496f-4418-ac8a-09d29ca379b9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201036071215', "PhoneNumberConfirmed" = true WHERE "Id" = '53e2ab4d-f324-4f1e-9480-67c9f2b709f1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('83bd30f9-1666-4a90-b4a2-0cc34e741124', '+201036071215', true, '2026-01-08 12:51:22', '2026-01-08 12:51:22', '53e2ab4d-f324-4f1e-9480-67c9f2b709f1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201142224762', "PhoneNumberConfirmed" = true WHERE "Id" = '4a45dac9-956d-4045-8aa8-3f95bd23185b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('641cb9f4-8d22-43db-bbe4-9498358d1be8', '+201142224762', true, '2026-04-10 18:58:59', '2026-04-10 18:58:59', '4a45dac9-956d-4045-8aa8-3f95bd23185b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201558112447', "PhoneNumberConfirmed" = true WHERE "Id" = '42c5fca4-9e11-43d0-8895-1f3a8b40a820';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5226344a-9bb7-4e07-966d-f6c1f1bed50a', '+201558112447', true, '2025-12-19 07:00:07', '2025-12-19 07:00:07', '42c5fca4-9e11-43d0-8895-1f3a8b40a820') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201121667768', "PhoneNumberConfirmed" = true WHERE "Id" = '9976c8f6-0844-40a4-be65-488ce971d480';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d2909cc5-ce94-43ea-b81f-54251c995e00', '+201121667768', true, '2026-01-09 22:44:51', '2026-01-09 22:44:51', '9976c8f6-0844-40a4-be65-488ce971d480') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+62895429524102', "PhoneNumberConfirmed" = true WHERE "Id" = 'aac1f228-d532-4c61-a6bd-419f416e9f0e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('00193859-e897-46f1-a0b3-34bb4c771c99', '+62895429524102', true, '2026-01-11 14:39:24', '2026-01-11 14:39:24', 'aac1f228-d532-4c61-a6bd-419f416e9f0e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201035360774', "PhoneNumberConfirmed" = true WHERE "Id" = '5bc35505-4d2c-4292-9bba-c95300f76336';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d969a93d-38db-401f-bb24-d7e10b4cecfa', '+201035360774', true, '2026-01-15 21:42:43', '2026-01-15 21:42:43', '5bc35505-4d2c-4292-9bba-c95300f76336') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099818035', "PhoneNumberConfirmed" = true WHERE "Id" = '1af0e711-26d5-4901-b152-79c288d88cee';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('73a41731-d803-4a4d-8a3b-cfa1c66da179', '+201099818035', true, '2026-01-18 12:25:55', '2026-01-18 12:25:55', '1af0e711-26d5-4901-b152-79c288d88cee') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060974314', "PhoneNumberConfirmed" = true WHERE "Id" = '1c90a62c-9bdc-4103-aa9b-f2ab7fe7704d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('25c0c04a-279b-435e-9884-da13bbd66e40', '+201060974314', true, '2026-01-17 02:04:08', '2026-01-17 02:04:08', '1c90a62c-9bdc-4103-aa9b-f2ab7fe7704d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021801144', "PhoneNumberConfirmed" = true WHERE "Id" = '5ff24bb1-bf45-40a6-b8ed-8389d204fb54';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('81bb52cc-c917-4907-acab-399bf6588d14', '+201021801144', true, '2026-02-04 10:15:31', '2026-02-04 10:15:31', '5ff24bb1-bf45-40a6-b8ed-8389d204fb54') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066867431', "PhoneNumberConfirmed" = true WHERE "Id" = 'dc50d5d4-647c-4e21-996c-4edc1620934f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2ed8d651-e74a-459f-9265-58bc85aedecc', '+201066867431', true, '2026-02-06 08:00:49', '2026-02-06 08:00:49', 'dc50d5d4-647c-4e21-996c-4edc1620934f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201272000090', "PhoneNumberConfirmed" = true WHERE "Id" = '9253661d-e503-4e7e-8374-519591a91dd3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c2b4abb9-b469-4483-b14a-c886eff2f641', '+201272000090', true, '2026-02-06 10:03:09', '2026-02-06 10:03:09', '9253661d-e503-4e7e-8374-519591a91dd3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201553636300', "PhoneNumberConfirmed" = true WHERE "Id" = '6cdd71fc-46dc-461e-9738-44d5960cfcf4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d0d503a4-5f11-4746-9aea-ca68a17317b8', '+201553636300', true, '2026-02-06 13:01:18', '2026-02-06 13:01:18', '6cdd71fc-46dc-461e-9738-44d5960cfcf4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201100303864', "PhoneNumberConfirmed" = true WHERE "Id" = '02ad883b-705c-4f52-a94f-45083085b370';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d776f76b-7cee-4be2-a015-24620c3eb9cb', '+201100303864', true, '2026-04-14 20:14:46', '2026-04-14 20:14:46', '02ad883b-705c-4f52-a94f-45083085b370') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010793073', "PhoneNumberConfirmed" = true WHERE "Id" = '13b23c3c-d746-4345-af44-84158e91c3ea';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1d271e85-a304-451f-a21e-4d91421b19c8', '+201010793073', true, '2025-11-10 05:52:47', '2025-11-10 05:52:47', '13b23c3c-d746-4345-af44-84158e91c3ea') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201032433408', "PhoneNumberConfirmed" = true WHERE "Id" = '96a33e99-16ec-4c8b-acc1-f0bbe4dd2c1a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('019ff3ec-a45c-4e06-afa5-ef4754dc186b', '+201032433408', true, '2025-12-14 15:18:11', '2025-12-14 15:18:11', '96a33e99-16ec-4c8b-acc1-f0bbe4dd2c1a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+9647874376458', "PhoneNumberConfirmed" = true WHERE "Id" = '44eee14d-9033-42d2-95a9-3b48a111b146';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d08fc609-61f1-4a7c-85d1-b4a41764e6ae', '+9647874376458', true, '2026-05-17 18:25:00', '2026-05-17 18:25:00', '44eee14d-9033-42d2-95a9-3b48a111b146') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201557952755', "PhoneNumberConfirmed" = true WHERE "Id" = '2677eadc-2e6d-4003-8601-b4112d13a526';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7997e3d8-3193-47e5-aa38-0981eae52a07', '+201557952755', true, '2025-12-15 23:20:16', '2025-12-15 23:20:16', '2677eadc-2e6d-4003-8601-b4112d13a526') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201127504843', "PhoneNumberConfirmed" = true WHERE "Id" = '55847a8d-af06-42c8-a69e-601eebb0ff9c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('adb05727-fe53-4a5e-8a27-e01c614f6170', '+201127504843', true, '2025-12-19 10:27:35', '2025-12-19 10:27:35', '55847a8d-af06-42c8-a69e-601eebb0ff9c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01200506732', "PhoneNumberConfirmed" = true WHERE "Id" = 'e0bb5cc1-b0cd-4e95-a648-af374c0b728b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1bf302a5-af16-42ca-a0d0-1206dc589067', '01200506732', true, '2025-12-17 15:01:29', '2025-12-17 15:01:29', 'e0bb5cc1-b0cd-4e95-a648-af374c0b728b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201507851043', "PhoneNumberConfirmed" = true WHERE "Id" = '44b6504c-e343-465f-b494-cd605e71c3f5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('93c3ae8a-8dfb-464f-a371-fc697dfbc248', '+201507851043', true, '2025-12-21 18:55:13', '2025-12-21 18:55:13', '44b6504c-e343-465f-b494-cd605e71c3f5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201109263663', "PhoneNumberConfirmed" = true WHERE "Id" = '9419c003-1365-47cd-94ec-79e8650e62c7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('15b144d2-3889-43c9-bc86-895a2b347291', '+201109263663', true, '2026-01-08 12:55:57', '2026-01-08 12:55:57', '9419c003-1365-47cd-94ec-79e8650e62c7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004915100', "PhoneNumberConfirmed" = true WHERE "Id" = 'e0c87736-4923-43b5-9749-6c5500b64043';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9fe10703-191f-4e21-b9e4-296f260be991', '+201004915100', true, '2025-12-29 09:40:57', '2025-12-29 09:40:57', 'e0c87736-4923-43b5-9749-6c5500b64043') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201210948535', "PhoneNumberConfirmed" = true WHERE "Id" = 'e4cc33f8-9a1b-4b0c-b632-5d536f4c78cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a8836449-fadc-43f2-882d-6f8f7bd44d06', '+201210948535', true, '2025-12-29 22:41:14', '2025-12-29 22:41:14', 'e4cc33f8-9a1b-4b0c-b632-5d536f4c78cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000693240', "PhoneNumberConfirmed" = true WHERE "Id" = 'c543b6a5-22bd-4064-8226-01418fe5e02f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('aa3a10dc-8df6-4c7a-871e-64297f11fb33', '+201000693240', true, '2025-12-31 17:44:34', '2025-12-31 17:44:34', 'c543b6a5-22bd-4064-8226-01418fe5e02f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201203762460', "PhoneNumberConfirmed" = true WHERE "Id" = '0f00cdf0-f0a5-4fc7-83c4-98ad19fcd79c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d3ef8c84-d825-481b-bfbe-fb34f3f4096e', '+201203762460', true, '2026-01-06 20:05:55', '2026-01-06 20:05:55', '0f00cdf0-f0a5-4fc7-83c4-98ad19fcd79c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01119185645', "PhoneNumberConfirmed" = true WHERE "Id" = '01a4c2ce-deff-4c66-94f9-a35a2abc3333';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2370b566-662d-427e-b6e6-8c5e47e59d27', '01119185645', true, '2025-11-30 22:16:17', '2025-11-30 22:16:17', '01a4c2ce-deff-4c66-94f9-a35a2abc3333') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201008886592', "PhoneNumberConfirmed" = true WHERE "Id" = '1bc02f04-c7f8-4174-b955-4b03a910b702';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fe0f27c0-7152-4892-bdee-63f9b063c0f0', '+201008886592', true, '2026-01-11 15:12:42', '2026-01-11 15:12:42', '1bc02f04-c7f8-4174-b955-4b03a910b702') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201116672350', "PhoneNumberConfirmed" = true WHERE "Id" = '366ba8ac-337a-4212-a1bd-e4abb1984d26';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0ba21ecc-1087-4a01-982c-87fc1b8c67f0', '+201116672350', true, '2026-01-13 12:59:51', '2026-01-13 12:59:51', '366ba8ac-337a-4212-a1bd-e4abb1984d26') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201554074086', "PhoneNumberConfirmed" = true WHERE "Id" = '4a679bb1-727b-47db-9e8f-68b271a8222a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9642baa0-2ef3-49cb-98d4-d148a31ea31c', '+201554074086', true, '2026-01-22 06:38:36', '2026-01-22 06:38:36', '4a679bb1-727b-47db-9e8f-68b271a8222a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201147910891', "PhoneNumberConfirmed" = true WHERE "Id" = '53e121b8-9b2a-414b-aeca-eb86bfa0aae0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bda11a4f-7c9b-4491-bb69-0eeace6f39f6', '+201147910891', true, '2026-01-18 13:07:28', '2026-01-18 13:07:28', '53e121b8-9b2a-414b-aeca-eb86bfa0aae0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061881465', "PhoneNumberConfirmed" = true WHERE "Id" = '0e8789a4-6432-416e-81c4-4ca2db20b35c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0a03c29f-4f21-43c3-a425-396c76e36b46', '+201061881465', true, '2026-01-17 02:04:05', '2026-01-17 02:04:05', '0e8789a4-6432-416e-81c4-4ca2db20b35c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092502264', "PhoneNumberConfirmed" = true WHERE "Id" = '2df00953-547d-4a32-8ad5-5f8c997a9d46';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ab52725e-5cfa-4d57-9d07-5d7fe534b49a', '+201092502264', true, '2026-02-05 13:44:55', '2026-02-05 13:44:55', '2df00953-547d-4a32-8ad5-5f8c997a9d46') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201503715515', "PhoneNumberConfirmed" = true WHERE "Id" = 'e0543437-f400-493b-bf32-17b572c36db3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1ebc2def-3980-4b24-9879-0a8cc9af735a', '+201503715515', true, '2026-04-13 18:08:52', '2026-04-13 18:08:52', 'e0543437-f400-493b-bf32-17b572c36db3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201212212686', "PhoneNumberConfirmed" = true WHERE "Id" = '2c716bf0-c1a4-4d95-8d86-87f9e4a71c31';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('455025d0-487d-4f55-90ee-34449394ea03', '+201212212686', true, '2026-02-07 19:25:56', '2026-02-07 19:25:56', '2c716bf0-c1a4-4d95-8d86-87f9e4a71c31') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090337747', "PhoneNumberConfirmed" = true WHERE "Id" = '31113ede-ec61-446a-906a-3039de51d8a9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('62173b00-c55e-4dd9-b002-b83e9f73321b', '+201090337747', true, '2025-11-10 06:45:44', '2025-11-10 06:45:44', '31113ede-ec61-446a-906a-3039de51d8a9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201270782733', "PhoneNumberConfirmed" = true WHERE "Id" = 'a56cd193-b1d9-4d48-bc0c-c52e7f0519ca';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('aa4d8314-aee8-4e2d-a55c-336a9b42d163', '+201270782733', true, '2025-11-12 07:15:32', '2025-11-12 07:15:32', 'a56cd193-b1d9-4d48-bc0c-c52e7f0519ca') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229363078', "PhoneNumberConfirmed" = true WHERE "Id" = 'e5ebbfd0-5cf9-4113-993c-ad42b4f56820';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f40dd7b7-d223-40ff-b652-93a8eab5c9b3', '+201229363078', true, '2025-11-10 21:56:10', '2025-11-10 21:56:10', 'e5ebbfd0-5cf9-4113-993c-ad42b4f56820') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01068504252', "PhoneNumberConfirmed" = true WHERE "Id" = 'fe109258-2388-4f20-993e-783ee0cd7cc9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('945115b7-02cd-481a-a3bb-c2ddb4793da7', '01068504252', true, '2025-11-30 23:24:06', '2025-11-30 23:24:06', 'fe109258-2388-4f20-993e-783ee0cd7cc9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201020520714', "PhoneNumberConfirmed" = true WHERE "Id" = '86afc697-9f17-446f-ab75-974dc1271fa9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('406de068-295f-4cf2-bea0-ae5b4b324e76', '+201020520714', true, '2025-11-14 10:57:25', '2025-11-14 10:57:25', '86afc697-9f17-446f-ab75-974dc1271fa9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201157590103', "PhoneNumberConfirmed" = true WHERE "Id" = '696c99c6-2120-450f-92b7-0b1ee35f9bcb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('834ea9ce-264d-46d4-af6d-8ec47f471b7c', '+201157590103', true, '2025-12-15 23:27:14', '2025-12-15 23:27:14', '696c99c6-2120-450f-92b7-0b1ee35f9bcb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201208254124', "PhoneNumberConfirmed" = true WHERE "Id" = 'd634ac92-12ec-46fa-9409-a71dcf799dee';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('191026e7-5aed-4477-897c-818d5a8cb6ff', '+201208254124', true, '2025-12-17 15:16:51', '2025-12-17 15:16:51', 'd634ac92-12ec-46fa-9409-a71dcf799dee') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201068851711', "PhoneNumberConfirmed" = true WHERE "Id" = 'ed998900-32ea-4612-800d-027c30808e91';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c23a48f8-4d65-4a2d-9c36-1719b48ec89d', '+201068851711', true, '2025-12-14 16:37:35', '2025-12-14 16:37:35', 'ed998900-32ea-4612-800d-027c30808e91') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002726517', "PhoneNumberConfirmed" = true WHERE "Id" = 'a2b141e6-028e-402e-82f4-a6b5398039b5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('986d94ee-516c-43a8-99b8-f9e096f284f2', '+201002726517', true, '2025-12-21 19:34:30', '2025-12-21 19:34:30', 'a2b141e6-028e-402e-82f4-a6b5398039b5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201228316608', "PhoneNumberConfirmed" = true WHERE "Id" = 'a76139f3-9443-4e1b-b702-5036a41511b1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6c1eba99-532f-4d48-b078-3248cc7914b1', '+201228316608', true, '2025-12-29 23:41:06', '2025-12-29 23:41:06', 'a76139f3-9443-4e1b-b702-5036a41511b1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201026622824', "PhoneNumberConfirmed" = true WHERE "Id" = 'fbe60dae-11ae-43df-a073-0ceac5ba5b4c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3b752806-e013-44a6-906a-85fdf61dc770', '+201026622824', true, '2025-12-19 11:12:01', '2025-12-19 11:12:01', 'fbe60dae-11ae-43df-a073-0ceac5ba5b4c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201023442320', "PhoneNumberConfirmed" = true WHERE "Id" = '7b27ed4b-9ee3-4ccf-b049-90c421e10ef0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e1fa75b2-1af2-4c18-a9bd-8adc41fd9551', '+201023442320', true, '2025-12-31 18:17:33', '2025-12-31 18:17:33', '7b27ed4b-9ee3-4ccf-b049-90c421e10ef0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066695928', "PhoneNumberConfirmed" = true WHERE "Id" = '9471f015-8598-4152-8d52-632be000bdff';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dca23040-12dc-4da3-b558-92e9a6f49bed', '+201066695928', true, '2025-12-29 10:48:19', '2025-12-29 10:48:19', '9471f015-8598-4152-8d52-632be000bdff') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201557377037', "PhoneNumberConfirmed" = true WHERE "Id" = 'f7baaeac-e16a-44c5-8770-9851aa0447cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('52c231f9-ab0e-401e-b6af-cc4a45cdd3fb', '+201557377037', true, '2026-01-06 22:36:52', '2026-01-06 22:36:52', 'f7baaeac-e16a-44c5-8770-9851aa0447cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01287495237', "PhoneNumberConfirmed" = true WHERE "Id" = '10e690d2-496c-4bc4-ab7f-18901b057e39';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a17dac26-0837-4091-8933-a08a9639121a', '01287495237', true, '2026-01-18 15:17:17', '2026-01-18 15:17:17', '10e690d2-496c-4bc4-ab7f-18901b057e39') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201007402875', "PhoneNumberConfirmed" = true WHERE "Id" = 'c0ced846-06ce-4b94-8108-67b808cd0d46';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7d86837d-ff34-422d-bbe0-359d098791a1', '+201007402875', true, '2026-01-10 00:27:24', '2026-01-10 00:27:24', 'c0ced846-06ce-4b94-8108-67b808cd0d46') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201207460420', "PhoneNumberConfirmed" = true WHERE "Id" = '96418a7d-ed97-4259-9df5-d7d640a4cc2e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1b3ca07c-cd17-4513-b286-9a336fc6252c', '+201207460420', true, '2026-01-08 15:43:50', '2026-01-08 15:43:50', '96418a7d-ed97-4259-9df5-d7d640a4cc2e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201227928908', "PhoneNumberConfirmed" = true WHERE "Id" = '408dc253-ee6e-4108-a5ea-bd37b73620ba';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('242e4a6b-8c0c-4fae-abe1-4af9ca3b1483', '+201227928908', true, '2026-01-11 20:06:08', '2026-01-11 20:06:08', '408dc253-ee6e-4108-a5ea-bd37b73620ba') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019661188', "PhoneNumberConfirmed" = true WHERE "Id" = '6e72eae2-b0bc-4994-abe2-2a4a9c4522c8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('83bd7716-2512-4f4a-b156-125619f3c2ea', '+201019661188', true, '2026-02-07 17:50:56', '2026-02-07 17:50:56', '6e72eae2-b0bc-4994-abe2-2a4a9c4522c8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201278905803', "PhoneNumberConfirmed" = true WHERE "Id" = '84dd8dbe-c658-4dac-8593-da44e8a488d4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7846fde3-eab6-40e6-a05a-4c51c9dabf22', '+201278905803', true, '2026-02-12 19:58:57', '2026-02-12 19:58:57', '84dd8dbe-c658-4dac-8593-da44e8a488d4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201127907255', "PhoneNumberConfirmed" = true WHERE "Id" = '6af44a84-63c8-4f07-86e1-0ccaadd89c54';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7d263e0c-ee82-4adf-971c-8e0979f49808', '+201127907255', true, '2026-02-06 14:39:02', '2026-02-06 14:39:02', '6af44a84-63c8-4f07-86e1-0ccaadd89c54') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201228825144', "PhoneNumberConfirmed" = true WHERE "Id" = '9da60ee9-08c3-4ef4-bbde-37cc57a5ec39';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2b196d83-b603-4365-97fd-e87350b8f064', '+201228825144', true, '2026-02-06 18:40:54', '2026-02-06 18:40:54', '9da60ee9-08c3-4ef4-bbde-37cc57a5ec39') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001459360', "PhoneNumberConfirmed" = true WHERE "Id" = '6390e51a-c1fe-41f4-b065-b761e5f8418d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2d612ab9-a3c9-4a5b-9f2d-374104500dae', '+201001459360', true, '2025-12-01 07:38:57', '2025-12-01 07:38:57', '6390e51a-c1fe-41f4-b065-b761e5f8418d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201271161638', "PhoneNumberConfirmed" = true WHERE "Id" = 'ebfca72c-d9b0-4b75-9545-57a92f8934c2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a57099c1-1ef2-4d18-8d86-c78c88fb6174', '+201271161638', true, '2025-11-10 07:12:37', '2025-11-10 07:12:37', 'ebfca72c-d9b0-4b75-9545-57a92f8934c2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201204008244', "PhoneNumberConfirmed" = true WHERE "Id" = '74085b7b-ede7-4103-bcba-1fa66fad20f6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3179c3a0-43c5-4257-8787-47fdee6fd69b', '+201204008244', true, '2025-12-14 16:49:24', '2025-12-14 16:49:24', '74085b7b-ede7-4103-bcba-1fa66fad20f6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01098097157', "PhoneNumberConfirmed" = true WHERE "Id" = 'd2cec843-da7f-487e-810d-67c7a5552553';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6980b0a4-bea6-4f7e-9394-28cb0ff6498f', '01098097157', true, '2025-12-15 23:54:29', '2025-12-15 23:54:29', 'd2cec843-da7f-487e-810d-67c7a5552553') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01152866260', "PhoneNumberConfirmed" = true WHERE "Id" = '048312fd-3159-4aa2-bb25-57aad025059d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('551f4593-3b48-45e8-8dfa-689bdb724988', '01152866260', true, '2025-12-17 15:55:54', '2025-12-17 15:55:54', '048312fd-3159-4aa2-bb25-57aad025059d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201125818020', "PhoneNumberConfirmed" = true WHERE "Id" = '83c3bb3e-ab8d-4187-a2f0-d825318857fd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('abfda0b0-555d-4ffd-8594-8d0dfa8de45b', '+201125818020', true, '2025-12-19 11:38:51', '2025-12-19 11:38:51', '83c3bb3e-ab8d-4187-a2f0-d825318857fd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201012869711', "PhoneNumberConfirmed" = true WHERE "Id" = '9d0cf972-8e88-42a9-9e1f-612f29762690';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('14ed9cde-8a4b-4b41-8cf8-8806a0900e39', '+201012869711', true, '2025-12-31 19:12:15', '2025-12-31 19:12:15', '9d0cf972-8e88-42a9-9e1f-612f29762690') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201559704155', "PhoneNumberConfirmed" = true WHERE "Id" = '99c2cfa8-455a-409a-833c-01adbe9e9392';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5100f4ca-a3ec-43a8-9d77-a62ce1b9df28', '+201559704155', true, '2026-01-08 19:28:21', '2026-01-08 19:28:21', '99c2cfa8-455a-409a-833c-01adbe9e9392') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201023284643', "PhoneNumberConfirmed" = true WHERE "Id" = '972086a6-91ab-4164-91d9-0670a14a60e9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c0d167e8-37dc-4a53-b9d3-ad56b58cec62', '+201023284643', true, '2026-01-06 22:53:08', '2026-01-06 22:53:08', '972086a6-91ab-4164-91d9-0670a14a60e9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201008029865', "PhoneNumberConfirmed" = true WHERE "Id" = '6a751104-299d-434a-8c77-054344d6749d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ada699fa-6263-4f54-ab2c-7dc47a7d3d9a', '+201008029865', true, '2026-01-13 13:47:15', '2026-01-13 13:47:15', '6a751104-299d-434a-8c77-054344d6749d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01222188274', "PhoneNumberConfirmed" = true WHERE "Id" = '486468e4-6cbb-4318-8bac-16ec68e6af56';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('acd9d484-1922-4fc8-8c5a-15562c7125ac', '01222188274', true, '2026-01-10 11:12:20', '2026-01-10 11:12:20', '486468e4-6cbb-4318-8bac-16ec68e6af56') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223751428', "PhoneNumberConfirmed" = true WHERE "Id" = '521f4c12-40f7-4687-8565-35dc4153196e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('501c729d-1c98-4223-9b18-da7a2a4e6a61', '+201223751428', true, '2026-01-22 07:56:40', '2026-01-22 07:56:40', '521f4c12-40f7-4687-8565-35dc4153196e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092085161', "PhoneNumberConfirmed" = true WHERE "Id" = 'e0bc24f0-6d3c-4f21-bf73-73fb6ed26c85';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('077be1a0-5396-492c-b400-21fcdb56d0e5', '+201092085161', true, '2026-01-18 15:44:06', '2026-01-18 15:44:06', 'e0bc24f0-6d3c-4f21-bf73-73fb6ed26c85') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201033168770', "PhoneNumberConfirmed" = true WHERE "Id" = '88ee645f-0f03-457f-8289-3529387bd87e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2545e918-ae53-4cc0-b18e-99fe6a9b02b7', '+201033168770', true, '2026-02-04 09:04:13', '2026-02-04 09:04:13', '88ee645f-0f03-457f-8289-3529387bd87e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067813902', "PhoneNumberConfirmed" = true WHERE "Id" = '9be25570-e9cb-420b-b686-1edcdaf7b35b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('eacfa3a4-3653-437f-bfa8-c3047e427e4c', '+201067813902', true, '2025-12-30 01:49:25', '2025-12-30 01:49:25', '9be25570-e9cb-420b-b686-1edcdaf7b35b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201288467749', "PhoneNumberConfirmed" = true WHERE "Id" = '77ce7ef3-d016-486b-a3e8-6f4a7c237b70';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cf4cccab-45b8-406d-8731-48dba98433f5', '+201288467749', true, '2026-02-07 00:04:21', '2026-02-07 00:04:21', '77ce7ef3-d016-486b-a3e8-6f4a7c237b70') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201118740102', "PhoneNumberConfirmed" = true WHERE "Id" = '6dcfa3b9-480f-4f44-a789-5b45ad0711b0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cb9c4f5f-05a2-4a83-b9ef-4ec700fbebda', '+201118740102', true, '2026-01-11 20:24:45', '2026-01-11 20:24:45', '6dcfa3b9-480f-4f44-a789-5b45ad0711b0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201148838483', "PhoneNumberConfirmed" = true WHERE "Id" = 'b7f4d6a5-8486-470c-ac50-52fe98bf665c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9085806e-c1c8-41d0-97a3-7be4b3050013', '+201148838483', true, '2026-02-04 00:40:47', '2026-02-04 00:40:47', 'b7f4d6a5-8486-470c-ac50-52fe98bf665c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061622828', "PhoneNumberConfirmed" = true WHERE "Id" = '334060a5-fd9b-4dd2-b60e-6186fb7afcaf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e35d05c3-6497-4e62-83ba-591d4da0b814', '+201061622828', true, '2026-02-04 10:40:29', '2026-02-04 10:40:29', '334060a5-fd9b-4dd2-b60e-6186fb7afcaf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01204664035', "PhoneNumberConfirmed" = true WHERE "Id" = '4516cb4f-0542-4477-acf8-a08637ec08d6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('143fb691-12ff-48a5-8f4d-a750631b9c7b', '01204664035', true, '2026-04-10 19:25:22', '2026-04-10 19:25:22', '4516cb4f-0542-4477-acf8-a08637ec08d6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201008586543', "PhoneNumberConfirmed" = true WHERE "Id" = '80a625ac-f146-49cf-88a2-1290654d90a6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('02406ec9-0d01-4776-bb79-be9707078b22', '+201008586543', true, '2025-11-10 07:20:21', '2025-11-10 07:20:21', '80a625ac-f146-49cf-88a2-1290654d90a6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01141495402', "PhoneNumberConfirmed" = true WHERE "Id" = 'a6e4c772-235a-4964-ba0a-a364825b1ad0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7aba2d20-ba9f-4b83-b96d-7a3f736c0f9a', '01141495402', true, '2025-12-17 16:36:09', '2025-12-17 16:36:09', 'a6e4c772-235a-4964-ba0a-a364825b1ad0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201285038755', "PhoneNumberConfirmed" = true WHERE "Id" = '9f761a92-67ce-41f8-a56e-8ecaa001b010';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('60a9fb5c-c2fa-419c-b77a-7324f38bebab', '+201285038755', true, '2025-12-21 19:55:49', '2025-12-21 19:55:49', '9f761a92-67ce-41f8-a56e-8ecaa001b010') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201202507693', "PhoneNumberConfirmed" = true WHERE "Id" = 'b2fb099f-03fc-4579-b401-fab1fa976c33';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7f527b0d-5a34-4dc2-a666-0c0c49067714', '+201202507693', true, '2026-01-10 11:26:19', '2026-01-10 11:26:19', 'b2fb099f-03fc-4579-b401-fab1fa976c33') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010973515', "PhoneNumberConfirmed" = true WHERE "Id" = 'b4f731ec-bef6-4f1d-9016-4f787c8b850f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5a79213f-683d-4f2f-ad5a-9aa21421a56f', '+201010973515', true, '2026-01-08 08:59:16', '2026-01-08 08:59:16', 'b4f731ec-bef6-4f1d-9016-4f787c8b850f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201273737650', "PhoneNumberConfirmed" = true WHERE "Id" = 'c74e20bd-cbe8-4e36-8a74-94b17ad124a2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('36fc285b-a3d4-4d67-81fc-8d00de7b8391', '+201273737650', true, '2025-12-30 07:41:39', '2025-12-30 07:41:39', 'c74e20bd-cbe8-4e36-8a74-94b17ad124a2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222703922', "PhoneNumberConfirmed" = true WHERE "Id" = 'dd9fb356-8358-4b73-ab36-c38dfb9c74a8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('588cf465-c0e9-403b-a97d-70b8e959d00a', '+201222703922', true, '2026-02-06 15:04:26', '2026-02-06 15:04:26', 'dd9fb356-8358-4b73-ab36-c38dfb9c74a8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201065047733', "PhoneNumberConfirmed" = true WHERE "Id" = 'e1149ef1-2a00-4c1e-bfa4-e278c0009425';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e331e2ea-4642-4b1b-b58d-f6b878255ee2', '+201065047733', true, '2026-02-06 03:12:36', '2026-02-06 03:12:36', 'e1149ef1-2a00-4c1e-bfa4-e278c0009425') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067844705', "PhoneNumberConfirmed" = true WHERE "Id" = '15829c96-c952-4901-bef5-77ca33028122';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d91cccff-e121-46ea-a526-c5b28195c7af', '+201067844705', true, '2025-12-31 19:19:07', '2025-12-31 19:19:07', '15829c96-c952-4901-bef5-77ca33028122') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092639191', "PhoneNumberConfirmed" = true WHERE "Id" = '8f5865d6-08b9-43ba-81ae-12d30a6a902d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1a716056-e6b3-41cb-a657-017d15d28655', '+201092639191', true, '2026-01-11 22:04:32', '2026-01-11 22:04:32', '8f5865d6-08b9-43ba-81ae-12d30a6a902d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201122977222', "PhoneNumberConfirmed" = true WHERE "Id" = '1ec0323b-d34d-4691-a0e9-40907745be2b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b0a69810-298c-40b2-8865-c8c0958353f3', '+201122977222', true, '2026-02-07 13:32:47', '2026-02-07 13:32:47', '1ec0323b-d34d-4691-a0e9-40907745be2b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201158300113', "PhoneNumberConfirmed" = true WHERE "Id" = 'be4730bc-19b3-44cc-9bb1-762985d1743d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('04f57fbf-02b5-44a6-8495-fe2e6e13b1b2', '+201158300113', true, '2026-01-13 14:12:23', '2026-01-13 14:12:23', 'be4730bc-19b3-44cc-9bb1-762985d1743d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201105570965', "PhoneNumberConfirmed" = true WHERE "Id" = '1c4e25e7-2db2-43ad-bfee-8622bfef699c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f2b1c03d-1208-466f-af4b-4d9ca8a784e5', '+201105570965', true, '2026-01-17 04:38:03', '2026-01-17 04:38:03', '1c4e25e7-2db2-43ad-bfee-8622bfef699c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01224486593', "PhoneNumberConfirmed" = true WHERE "Id" = 'b88ad316-14f8-419b-8d0f-454cac847707';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('85b5476c-03d2-4ed3-aa99-f52981ed8239', '01224486593', true, '2025-12-16 01:46:29', '2025-12-16 01:46:29', 'b88ad316-14f8-419b-8d0f-454cac847707') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201283339457', "PhoneNumberConfirmed" = true WHERE "Id" = '48fb7fef-bdff-4057-80f5-a5f30206c87d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('155ae9d2-d5dc-450e-99d4-8687250e667d', '+201283339457', true, '2026-02-04 00:41:36', '2026-02-04 00:41:36', '48fb7fef-bdff-4057-80f5-a5f30206c87d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201221527600', "PhoneNumberConfirmed" = true WHERE "Id" = '785bb723-7ccc-43e6-a8b4-3375c1e3c242';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('93f883cc-011e-486b-8465-057110f506f6', '+201221527600', true, '2026-02-07 19:30:34', '2026-02-07 19:30:34', '785bb723-7ccc-43e6-a8b4-3375c1e3c242') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201112207125', "PhoneNumberConfirmed" = true WHERE "Id" = '22125169-e754-4df5-8281-27c0a4efb0d0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a1b9c793-31cd-4131-b51a-7365f33f8e63', '+201112207125', true, '2026-04-29 15:16:05', '2026-04-29 15:16:05', '22125169-e754-4df5-8281-27c0a4efb0d0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002639988', "PhoneNumberConfirmed" = true WHERE "Id" = '16be41b8-b94d-4d38-a5f1-5c320575deba';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('06d7d655-958e-442b-852a-6629445abcf2', '+201002639988', true, '2026-02-06 14:43:40', '2026-02-06 14:43:40', '16be41b8-b94d-4d38-a5f1-5c320575deba') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201555554506', "PhoneNumberConfirmed" = true WHERE "Id" = 'dc82e382-85d1-42c1-bfd1-484b16ff35fe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a9370d32-0bf5-48e7-b8af-795d681fef81', '+201555554506', true, '2026-04-29 19:57:45', '2026-04-29 19:57:45', 'dc82e382-85d1-42c1-bfd1-484b16ff35fe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030940960', "PhoneNumberConfirmed" = true WHERE "Id" = 'c1bb33a6-d11c-42ee-9e2a-e37ab1ca6ba5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6b370ae1-ac1b-4540-b5d8-289307cfe30c', '+201030940960', true, '2026-02-08 16:06:03', '2026-02-08 16:06:03', 'c1bb33a6-d11c-42ee-9e2a-e37ab1ca6ba5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201097067419', "PhoneNumberConfirmed" = true WHERE "Id" = '50c2290a-25f2-44e6-890f-0c941d1e8fa9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1d0c1119-b552-4f1e-9787-caae01411918', '+201097067419', true, '2025-11-10 07:34:29', '2025-11-10 07:34:29', '50c2290a-25f2-44e6-890f-0c941d1e8fa9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01116212561', "PhoneNumberConfirmed" = true WHERE "Id" = '0fdc6ca7-1c1f-4889-abea-88c55a920c40';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('91052759-a1a4-49c4-bba3-bf7209d466e6', '01116212561', true, '2025-12-01 21:29:43', '2025-12-01 21:29:43', '0fdc6ca7-1c1f-4889-abea-88c55a920c40') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01118439291', "PhoneNumberConfirmed" = true WHERE "Id" = '9f1a2706-467c-492d-96a9-0674b95ebe50';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0ef3047a-8b69-4804-9190-969cd64f27f7', '01118439291', true, '2025-12-16 10:04:17', '2025-12-16 10:04:17', '9f1a2706-467c-492d-96a9-0674b95ebe50') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004615516', "PhoneNumberConfirmed" = true WHERE "Id" = 'fe81c676-329a-41a1-8a28-39eff16271f8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e4803992-b99f-47ab-98d8-187735db2987', '+201004615516', true, '2025-12-21 23:41:51', '2025-12-21 23:41:51', 'fe81c676-329a-41a1-8a28-39eff16271f8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229790733', "PhoneNumberConfirmed" = true WHERE "Id" = 'd9eac6b9-024e-4f3b-968f-55f25d7c5814';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9dcd01e4-454a-4c78-9765-9b4544013f1d', '+201229790733', true, '2025-12-17 18:14:07', '2025-12-17 18:14:07', 'd9eac6b9-024e-4f3b-968f-55f25d7c5814') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223526698', "PhoneNumberConfirmed" = true WHERE "Id" = 'ff9c30d5-d32e-4c33-bae2-3df7f0ad8cf0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('707686b5-49f0-44c7-8e35-e895d10b7e4b', '+201223526698', true, '2025-12-19 13:33:45', '2025-12-19 13:33:45', 'ff9c30d5-d32e-4c33-bae2-3df7f0ad8cf0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201006913557', "PhoneNumberConfirmed" = true WHERE "Id" = '0ec5065a-a1e9-47d5-86db-a64642be7991';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e736b3ad-8459-45df-9141-43bce1da3607', '+201006913557', true, '2025-12-30 09:48:56', '2025-12-30 09:48:56', '0ec5065a-a1e9-47d5-86db-a64642be7991') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201096945434', "PhoneNumberConfirmed" = true WHERE "Id" = '7dc5de26-3f22-425f-a877-1b676be9b71f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('55ba9af6-a0d1-4d14-93d0-e214678a8653', '+201096945434', true, '2025-12-31 22:57:44', '2025-12-31 22:57:44', '7dc5de26-3f22-425f-a877-1b676be9b71f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060748949', "PhoneNumberConfirmed" = true WHERE "Id" = '4d02087b-9594-4edb-a7ed-d6242b384cf3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('83b7290c-c806-4463-b0d0-264f7c6f2244', '+201060748949', true, '2026-01-07 14:13:54', '2026-01-07 14:13:54', '4d02087b-9594-4edb-a7ed-d6242b384cf3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098721189', "PhoneNumberConfirmed" = true WHERE "Id" = '809a7a2c-eb4e-42ae-befb-c191348f121c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('55ff1c2d-1bb8-40aa-bd96-a1a3d0a3b701', '+201098721189', true, '2026-04-30 20:56:47', '2026-04-30 20:56:47', '809a7a2c-eb4e-42ae-befb-c191348f121c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201558763958', "PhoneNumberConfirmed" = true WHERE "Id" = '78834e79-cb24-48f6-92a7-68b6f44839d6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('78af6e4a-2d7e-43e9-a8fb-1cc6e98a0c3f', '+201558763958', true, '2026-01-08 20:53:12', '2026-01-08 20:53:12', '78834e79-cb24-48f6-92a7-68b6f44839d6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201062605736', "PhoneNumberConfirmed" = true WHERE "Id" = '594735dd-d999-4fef-8c7d-7b27b7988fd9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ed399604-bfcc-4355-99fa-2268da4cbd79', '+201062605736', true, '2026-01-10 13:03:56', '2026-01-10 13:03:56', '594735dd-d999-4fef-8c7d-7b27b7988fd9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201014828823', "PhoneNumberConfirmed" = true WHERE "Id" = '69bd833b-d831-45fa-ab12-5225a2512322';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ddd3f3f6-aa06-4b85-9259-013b1a90e3d8', '+201014828823', true, '2026-04-15 05:32:31', '2026-04-15 05:32:31', '69bd833b-d831-45fa-ab12-5225a2512322') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201552118685', "PhoneNumberConfirmed" = true WHERE "Id" = '37155c5b-2cd4-4f0e-aece-563fcdac9452';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('967d50bf-2309-45f3-aa88-026b3fa4e239', '+201552118685', true, '2025-12-14 18:39:41', '2025-12-14 18:39:41', '37155c5b-2cd4-4f0e-aece-563fcdac9452') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025682752', "PhoneNumberConfirmed" = true WHERE "Id" = 'd4d836e9-889b-495d-834a-44b631a495ea';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('67271016-db23-4f1c-8b6e-d55de03c39b3', '+201025682752', true, '2026-01-11 23:52:04', '2026-01-11 23:52:04', 'd4d836e9-889b-495d-834a-44b631a495ea') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201013768007', "PhoneNumberConfirmed" = true WHERE "Id" = '723b6161-8a56-42e8-83b9-62160e9e2ba2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2b9c1828-6627-442e-b670-3d280c41a1d6', '+201013768007', true, '2026-01-13 14:36:58', '2026-01-13 14:36:58', '723b6161-8a56-42e8-83b9-62160e9e2ba2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201278513132', "PhoneNumberConfirmed" = true WHERE "Id" = 'd036ce90-9fb5-4c7d-865c-60e3c4af5958';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8125c71e-867f-458a-ba37-ecf797a92d9c', '+201278513132', true, '2026-01-22 23:42:02', '2026-01-22 23:42:02', 'd036ce90-9fb5-4c7d-865c-60e3c4af5958') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064096050', "PhoneNumberConfirmed" = true WHERE "Id" = '262188f5-a721-4a2a-a5c0-e0b8e8fb0946';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('440f87ba-554a-4552-8ccb-dce0d0e0266c', '+201064096050', true, '2026-01-18 17:09:12', '2026-01-18 17:09:12', '262188f5-a721-4a2a-a5c0-e0b8e8fb0946') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099596677', "PhoneNumberConfirmed" = true WHERE "Id" = '753d7908-255e-4ee1-9421-5ec068af3c21';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8ecca8d0-55a2-4df9-9a93-a149f61deee4', '+201099596677', true, '2026-02-04 12:08:09', '2026-02-04 12:08:09', '753d7908-255e-4ee1-9421-5ec068af3c21') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201116946362', "PhoneNumberConfirmed" = true WHERE "Id" = 'd42db33d-8e34-4da5-b9b1-9a75a4f13904';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('625b6822-94ae-4225-9e38-2c5bb30e23fa', '+201116946362', true, '2026-02-06 13:16:41', '2026-02-06 13:16:41', 'd42db33d-8e34-4da5-b9b1-9a75a4f13904') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061413289', "PhoneNumberConfirmed" = true WHERE "Id" = '295b757d-f630-4835-84d7-5168268dbf7d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f10ef83e-ab7f-4459-8a78-d8405260a424', '+201061413289', true, '2026-02-06 14:44:07', '2026-02-06 14:44:07', '295b757d-f630-4835-84d7-5168268dbf7d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002221244', "PhoneNumberConfirmed" = true WHERE "Id" = '47012222-2390-4b3a-9f15-976d80c9fa6a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5fef4d97-1398-4472-a21d-3d35e9468250', '+201002221244', true, '2025-11-10 08:03:31', '2025-11-10 08:03:31', '47012222-2390-4b3a-9f15-976d80c9fa6a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201018739205', "PhoneNumberConfirmed" = true WHERE "Id" = '252956e1-040c-448e-a62b-df17be3c0845';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('37cc83b0-59db-439c-8959-37288068a774', '+201018739205', true, '2025-11-11 05:10:44', '2025-11-11 05:10:44', '252956e1-040c-448e-a62b-df17be3c0845') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01143191703', "PhoneNumberConfirmed" = true WHERE "Id" = '76e29eaf-1cdf-4882-b0be-77b1185d628b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6757b325-e5b0-4a79-971d-cbbf971ddfcd', '01143191703', true, '2025-12-16 11:06:44', '2025-12-16 11:06:44', '76e29eaf-1cdf-4882-b0be-77b1185d628b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01274489902', "PhoneNumberConfirmed" = true WHERE "Id" = 'b90799ad-6442-49bb-9624-4e4de34f3fb7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b93ddb26-9939-4348-864b-19aa43db0423', '01274489902', true, '2025-12-02 06:42:47', '2025-12-02 06:42:47', 'b90799ad-6442-49bb-9624-4e4de34f3fb7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201111746403', "PhoneNumberConfirmed" = true WHERE "Id" = '846103ed-dba3-4909-8304-2c49758be682';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('616bb7c2-67b5-4a92-9fde-9368cd45cbd1', '+201111746403', true, '2025-12-30 09:51:32', '2025-12-30 09:51:32', '846103ed-dba3-4909-8304-2c49758be682') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229799073', "PhoneNumberConfirmed" = true WHERE "Id" = 'd0c4ef98-e1f5-47f0-b62c-444cd149efc9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9bbc196b-7eb9-4ae7-aa46-38c8a1c1719a', '+201229799073', true, '2025-12-19 13:44:52', '2025-12-19 13:44:52', 'd0c4ef98-e1f5-47f0-b62c-444cd149efc9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223693319', "PhoneNumberConfirmed" = true WHERE "Id" = '43d5e1b3-34f9-4e93-a307-123ef38bead6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('06b3c84c-c50e-462c-b1d6-0534d0ddea88', '+201223693319', true, '2026-01-01 00:08:16', '2026-01-01 00:08:16', '43d5e1b3-34f9-4e93-a307-123ef38bead6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201094219801', "PhoneNumberConfirmed" = true WHERE "Id" = '17d0a7e9-4e15-41bb-92ce-0b012b229f3e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fae64204-f108-42c9-a432-83da2e222b2d', '+201094219801', true, '2025-12-22 09:44:27', '2025-12-22 09:44:27', '17d0a7e9-4e15-41bb-92ce-0b012b229f3e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201015925419', "PhoneNumberConfirmed" = true WHERE "Id" = '9e0c53e4-c0dc-4f64-866f-53b418041c56';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dd9d0413-323c-4554-8511-001517fa61a9', '+201015925419', true, '2026-01-13 15:14:32', '2026-01-13 15:14:32', '9e0c53e4-c0dc-4f64-866f-53b418041c56') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201008629090', "PhoneNumberConfirmed" = true WHERE "Id" = '63c283a9-41d9-457d-bd5f-bdef1aea5d3c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e6d44fee-4602-4714-964e-7e330fec18e9', '+201008629090', true, '2026-02-11 16:55:08', '2026-02-11 16:55:08', '63c283a9-41d9-457d-bd5f-bdef1aea5d3c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201129500631', "PhoneNumberConfirmed" = true WHERE "Id" = 'dcc27b5f-dc68-40ab-8510-7f2f96489a33';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2e767eef-489b-4aa9-affd-b0c031160845', '+201129500631', true, '2026-01-07 23:19:26', '2026-01-07 23:19:26', 'dcc27b5f-dc68-40ab-8510-7f2f96489a33') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201280110993', "PhoneNumberConfirmed" = true WHERE "Id" = '6df39d5a-c739-4181-ba4a-4010b4038a14';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('64e9f82b-bd9c-4413-9eda-7c102730baea', '+201280110993', true, '2026-01-15 23:59:44', '2026-01-15 23:59:44', '6df39d5a-c739-4181-ba4a-4010b4038a14') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001781222', "PhoneNumberConfirmed" = true WHERE "Id" = 'd285a0ce-1411-4c4d-ad17-d2745d2afe64';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('278c880a-83c9-48d7-be3e-c3efd8405a11', '+201001781222', true, '2026-01-08 21:05:34', '2026-01-08 21:05:34', 'd285a0ce-1411-4c4d-ad17-d2745d2afe64') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201115959996', "PhoneNumberConfirmed" = true WHERE "Id" = '134e2d05-5f43-450d-bb54-6bfaf3e45527';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3baa5b7c-e793-4132-9413-66ffb9455e44', '+201115959996', true, '2026-01-10 13:11:03', '2026-01-10 13:11:03', '134e2d05-5f43-450d-bb54-6bfaf3e45527') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090845657', "PhoneNumberConfirmed" = true WHERE "Id" = '169acc52-cd4f-4e9c-8702-1bcdcd05c29a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('60e9ae9d-0419-4ed6-bdff-6a931292fa2e', '+201090845657', true, '2026-01-12 01:18:38', '2026-01-12 01:18:38', '169acc52-cd4f-4e9c-8702-1bcdcd05c29a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201150088039', "PhoneNumberConfirmed" = true WHERE "Id" = '85df868f-cb29-4350-903d-fcf65fcbd05f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d9e8884b-e4ec-4e5d-9299-909e94e92dd9', '+201150088039', true, '2026-01-17 10:15:21', '2026-01-17 10:15:21', '85df868f-cb29-4350-903d-fcf65fcbd05f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201220494599', "PhoneNumberConfirmed" = true WHERE "Id" = '97d4ee88-a75a-4e9c-8010-c110402b06b3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0d10d4be-6127-44a7-9b19-c8d5f46728aa', '+201220494599', true, '2026-01-18 21:12:25', '2026-01-18 21:12:25', '97d4ee88-a75a-4e9c-8010-c110402b06b3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010157587', "PhoneNumberConfirmed" = true WHERE "Id" = 'ab2e1b66-e7b8-471a-97c3-2e8698d30b20';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6c0a9360-8058-474c-8128-1855709b2339', '+201010157587', true, '2026-01-23 16:32:23', '2026-01-23 16:32:23', 'ab2e1b66-e7b8-471a-97c3-2e8698d30b20') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201228453375', "PhoneNumberConfirmed" = true WHERE "Id" = '835fbe3a-e961-49bf-9460-c5c528c1b3a7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a7847e69-b88f-4033-b324-0c861c345356', '+201228453375', true, '2026-02-05 17:29:26', '2026-02-05 17:29:26', '835fbe3a-e961-49bf-9460-c5c528c1b3a7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201069338235', "PhoneNumberConfirmed" = true WHERE "Id" = '7f30791a-c5b5-480f-8b49-498213c2f016';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e8727cea-123b-4e65-8a47-8c83cd0f40a4', '+201069338235', true, '2026-02-04 12:20:03', '2026-02-04 12:20:03', '7f30791a-c5b5-480f-8b49-498213c2f016') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201055675670', "PhoneNumberConfirmed" = true WHERE "Id" = '621de417-6523-4da5-a695-66e3d34945a6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6803fc1f-43f0-4033-898a-cf584fb90fe0', '+201055675670', true, '2026-04-12 20:26:27', '2026-04-12 20:26:27', '621de417-6523-4da5-a695-66e3d34945a6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201065086862', "PhoneNumberConfirmed" = true WHERE "Id" = 'c667d29e-e0fc-491e-b702-ed7acab4157f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('98d817e0-6ccf-48bf-b51b-be353cee322d', '+201065086862', true, '2026-02-07 18:07:15', '2026-02-07 18:07:15', 'c667d29e-e0fc-491e-b702-ed7acab4157f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201550198058', "PhoneNumberConfirmed" = true WHERE "Id" = 'c7355ecc-5f19-4e91-b9d6-5c55b12305e2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f57750a3-5dbb-4560-8561-76f2d26a9097', '+201550198058', true, '2025-11-11 05:39:29', '2025-11-11 05:39:29', 'c7355ecc-5f19-4e91-b9d6-5c55b12305e2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201027446449', "PhoneNumberConfirmed" = true WHERE "Id" = 'fd363b44-f3cb-4f41-8116-ad4f19413c42';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c748ffb1-be1f-415f-b09e-4587645a57fd', '+201027446449', true, '2025-11-15 05:19:20', '2025-11-15 05:19:20', 'fd363b44-f3cb-4f41-8116-ad4f19413c42') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01018979064', "PhoneNumberConfirmed" = true WHERE "Id" = 'd7771548-60b5-4b06-8e36-595c3765fa4a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e8a3010a-06bc-4824-adbd-54bd36d451e1', '01018979064', true, '2025-12-02 08:47:38', '2025-12-02 08:47:38', 'd7771548-60b5-4b06-8e36-595c3765fa4a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201284847001', "PhoneNumberConfirmed" = true WHERE "Id" = '6732f5f9-a343-44be-91af-01d47b1714b6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('79b6dd6b-34fe-46b2-9d25-1af50e07b0c9', '+201284847001', true, '2025-12-14 20:13:47', '2025-12-14 20:13:47', '6732f5f9-a343-44be-91af-01d47b1714b6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229632583', "PhoneNumberConfirmed" = true WHERE "Id" = '7f0dfd84-6654-4a2c-9eb2-2907f3e50e22';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2d806a60-dc51-4641-8f98-8d27d0b402e3', '+201229632583', true, '2025-12-19 13:49:46', '2025-12-19 13:49:46', '7f0dfd84-6654-4a2c-9eb2-2907f3e50e22') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201006656366', "PhoneNumberConfirmed" = true WHERE "Id" = 'b3d0eaf2-345c-4db2-ae80-752384f5e28c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fa0057ff-ec17-4641-a3d7-f4306c720ad3', '+201006656366', true, '2025-12-17 18:55:41', '2025-12-17 18:55:41', 'b3d0eaf2-345c-4db2-ae80-752384f5e28c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01006564111', "PhoneNumberConfirmed" = true WHERE "Id" = '9aa677e6-dada-4bca-af6c-e35a9c388149';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8ef9b6cb-6f74-49f2-a69e-f33e7e5dd7f0', '01006564111', true, '2026-01-07 23:17:44', '2026-01-07 23:17:44', '9aa677e6-dada-4bca-af6c-e35a9c388149') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201122487679', "PhoneNumberConfirmed" = true WHERE "Id" = '0f411310-ffbc-400f-80b1-3c757f9c2fc9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a78cc694-50b2-450e-beba-1b2a8d9bb4e1', '+201122487679', true, '2025-12-22 11:17:45', '2025-12-22 11:17:45', '0f411310-ffbc-400f-80b1-3c757f9c2fc9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019525854', "PhoneNumberConfirmed" = true WHERE "Id" = '96420395-1133-4924-ba66-85682f63dda5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bbe04b01-2475-4cfe-8b14-c2da96c7fdd6', '+201019525854', true, '2026-01-01 00:23:24', '2026-01-01 00:23:24', '96420395-1133-4924-ba66-85682f63dda5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201550014501', "PhoneNumberConfirmed" = true WHERE "Id" = 'a52cd789-fb94-43a1-b5d7-f786c3261f27';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5771a6d0-5e22-49c7-b7c6-81e9b0234845', '+201550014501', true, '2026-05-10 13:20:26', '2026-05-10 13:20:26', 'a52cd789-fb94-43a1-b5d7-f786c3261f27') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201121112172', "PhoneNumberConfirmed" = true WHERE "Id" = 'a7fb203f-b148-4193-8d1a-d3a566ee6d08';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c6573739-6788-41ff-9d50-944ebcf5838d', '+201121112172', true, '2026-01-08 21:47:46', '2026-01-08 21:47:46', 'a7fb203f-b148-4193-8d1a-d3a566ee6d08') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201012602604', "PhoneNumberConfirmed" = true WHERE "Id" = 'a7ba1ca3-8fec-460a-acf5-372d55aaeccc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ec4dc008-fdf4-493b-b351-49807a9f55e4', '+201012602604', true, '2026-01-13 16:07:41', '2026-01-13 16:07:41', 'a7ba1ca3-8fec-460a-acf5-372d55aaeccc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+971585894982', "PhoneNumberConfirmed" = true WHERE "Id" = '43fbc9e9-d533-4a84-a957-e3ea443984c1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fd32465a-4246-4ad7-b3ff-a80093aad089', '+971585894982', true, '2025-12-30 12:18:10', '2025-12-30 12:18:10', '43fbc9e9-d533-4a84-a957-e3ea443984c1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201157788650', "PhoneNumberConfirmed" = true WHERE "Id" = '54f508c2-89c8-40ba-8e97-3751dda7ac9b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('309f3e53-14c8-425f-8daf-a8ea46040452', '+201157788650', true, '2026-01-12 06:09:15', '2026-01-12 06:09:15', '54f508c2-89c8-40ba-8e97-3751dda7ac9b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201055191656', "PhoneNumberConfirmed" = true WHERE "Id" = 'bda03d90-29e8-41cd-8ac3-9a5eff7748e5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('94495866-b098-4768-99a7-7757a521be3d', '+201055191656', true, '2026-01-18 23:37:41', '2026-01-18 23:37:41', 'bda03d90-29e8-41cd-8ac3-9a5eff7748e5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201062541588', "PhoneNumberConfirmed" = true WHERE "Id" = '0a188bbd-0a07-41dd-809f-503ac61a671f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('09e020d2-959b-4065-8e6f-e444fd63d2bd', '+201062541588', true, '2026-04-12 21:21:03', '2026-04-12 21:21:03', '0a188bbd-0a07-41dd-809f-503ac61a671f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003495586', "PhoneNumberConfirmed" = true WHERE "Id" = '50024826-f90a-4481-b4b3-58de1c49688b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('49abb4f0-1b15-46b6-a413-a47ca333e081', '+201003495586', true, '2026-02-07 19:35:32', '2026-02-07 19:35:32', '50024826-f90a-4481-b4b3-58de1c49688b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060055635', "PhoneNumberConfirmed" = true WHERE "Id" = '64a46eca-64da-46fc-85c2-d99eaab50816';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('46a3cd16-3185-4efe-b1b0-b99eea56d3bd', '+201060055635', true, '2026-04-13 12:21:27', '2026-04-13 12:21:27', '64a46eca-64da-46fc-85c2-d99eaab50816') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201020601382', "PhoneNumberConfirmed" = true WHERE "Id" = '25da5db8-1b04-4960-9591-590fdafb6673';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c38c18b6-8c87-4654-9283-3eae5bebe3b7', '+201020601382', true, '2025-11-11 08:22:10', '2025-11-11 08:22:10', '25da5db8-1b04-4960-9591-590fdafb6673') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201274346053', "PhoneNumberConfirmed" = true WHERE "Id" = '82572988-eda0-4f95-89a1-81465b863fb4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8b034f40-941d-4958-a0c6-021eded37462', '+201274346053', true, '2025-11-15 11:44:22', '2025-11-15 11:44:22', '82572988-eda0-4f95-89a1-81465b863fb4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092743504', "PhoneNumberConfirmed" = true WHERE "Id" = '48c6e7ba-0c02-4a35-8065-687e94e55f91';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('95311bbf-c3de-45a0-a7b3-ee4f38d7f6ab', '+201092743504', true, '2025-12-16 13:35:41', '2025-12-16 13:35:41', '48c6e7ba-0c02-4a35-8065-687e94e55f91') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01148349989', "PhoneNumberConfirmed" = true WHERE "Id" = 'b39741f1-87e5-4c4e-bb6a-15c14d6d20b6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3f9ad21e-38fb-4b47-9271-7bbf7efc7153', '01148349989', true, '2025-12-14 21:31:29', '2025-12-14 21:31:29', 'b39741f1-87e5-4c4e-bb6a-15c14d6d20b6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201009281629', "PhoneNumberConfirmed" = true WHERE "Id" = '6eb96cf6-c3bc-411c-825f-15f0cb53c4ee';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4acfd59f-fef6-4cd8-aaf9-a2ff20aa6cdb', '+201009281629', true, '2025-12-19 14:54:28', '2025-12-19 14:54:28', '6eb96cf6-c3bc-411c-825f-15f0cb53c4ee') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201159613165', "PhoneNumberConfirmed" = true WHERE "Id" = '2286a5a9-81a5-42f4-a461-ac37a9b0b211';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('76d14014-3c27-4f4b-b878-3301bc6973d7', '+201159613165', true, '2025-12-17 20:48:45', '2025-12-17 20:48:45', '2286a5a9-81a5-42f4-a461-ac37a9b0b211') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201150740307', "PhoneNumberConfirmed" = true WHERE "Id" = 'd8ca5942-5742-47e0-b75c-991f04d79057';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3e5f7ed7-6313-49e5-8442-94fbbe1a7ab4', '+201150740307', true, '2026-06-13 22:50:02', '2026-06-13 22:50:02', 'd8ca5942-5742-47e0-b75c-991f04d79057') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01067738133', "PhoneNumberConfirmed" = true WHERE "Id" = 'b919eeb1-6995-499d-856b-1813cdc94c62';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cbfdf6fc-19d2-4864-ae39-d243ade468b7', '01067738133', true, '2026-01-10 14:33:55', '2026-01-10 14:33:55', 'b919eeb1-6995-499d-856b-1813cdc94c62') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201013257886', "PhoneNumberConfirmed" = true WHERE "Id" = 'ce2c7764-fd3b-46f8-ac87-88b9fd5d5a20';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c0d85f4d-5bc2-48b9-9346-d324d01aca91', '+201013257886', true, '2025-12-30 12:37:44', '2025-12-30 12:37:44', 'ce2c7764-fd3b-46f8-ac87-88b9fd5d5a20') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201027573020', "PhoneNumberConfirmed" = true WHERE "Id" = 'e3d3a7ab-c0f7-40ba-9637-30b56a769837';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('88a7ef6b-606d-49f0-b358-4b1676095e58', '+201027573020', true, '2026-01-12 09:59:00', '2026-01-12 09:59:00', 'e3d3a7ab-c0f7-40ba-9637-30b56a769837') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201286006470', "PhoneNumberConfirmed" = true WHERE "Id" = '3049828f-3717-4bfa-a420-a4a51e95373d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7911c729-ef77-4cec-97e2-41c0c06def53', '+201286006470', true, '2025-12-22 11:19:22', '2025-12-22 11:19:22', '3049828f-3717-4bfa-a420-a4a51e95373d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01096593822', "PhoneNumberConfirmed" = true WHERE "Id" = '5c6645b3-89b4-4ddd-b49f-c44508dc6648';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('252b619e-ebea-4ec2-bdb5-9259215d66a4', '01096593822', true, '2025-12-02 12:54:46', '2025-12-02 12:54:46', '5c6645b3-89b4-4ddd-b49f-c44508dc6648') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098942731', "PhoneNumberConfirmed" = true WHERE "Id" = '216e6fd2-5f67-4aab-855f-33e26d0633f0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7811ba0c-ca97-4759-b971-8c3406c316bc', '+201098942731', true, '2026-04-29 15:18:24', '2026-04-29 15:18:24', '216e6fd2-5f67-4aab-855f-33e26d0633f0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030915308', "PhoneNumberConfirmed" = true WHERE "Id" = '1501f32d-ec36-4e0d-a20d-558b0ba6217e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b3000ad9-c986-40ed-a99f-13d19276f85b', '+201030915308', true, '2026-01-18 23:39:23', '2026-01-18 23:39:23', '1501f32d-ec36-4e0d-a20d-558b0ba6217e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004734750', "PhoneNumberConfirmed" = true WHERE "Id" = 'f256b5df-1e61-4ee1-ba1e-94a6698cfcf1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4cef537d-7acc-477a-98ba-f475e3cdcae9', '+201004734750', true, '2026-01-25 16:43:31', '2026-01-25 16:43:31', 'f256b5df-1e61-4ee1-ba1e-94a6698cfcf1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201277558650', "PhoneNumberConfirmed" = true WHERE "Id" = '200fe470-1048-404f-a27a-49d490e1f7c2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9ee9eb06-323c-4cee-95f6-c7891c091279', '+201277558650', true, '2026-02-04 00:44:33', '2026-02-04 00:44:33', '200fe470-1048-404f-a27a-49d490e1f7c2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021292991', "PhoneNumberConfirmed" = true WHERE "Id" = '4d3731b1-a9d0-4e57-a9d2-6fd4d2b67a52';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8c4de65b-2a1a-421a-8090-63729876cf28', '+201021292991', true, '2026-02-03 20:01:16', '2026-02-03 20:01:16', '4d3731b1-a9d0-4e57-a9d2-6fd4d2b67a52') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004457444', "PhoneNumberConfirmed" = true WHERE "Id" = '10b193b5-7911-4121-a46a-d1eab8f1c2de';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ea0c007f-f81f-4a99-8732-1b891636f290', '+201004457444', true, '2026-02-05 20:46:19', '2026-02-05 20:46:19', '10b193b5-7911-4121-a46a-d1eab8f1c2de') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025183130', "PhoneNumberConfirmed" = true WHERE "Id" = '834274b9-d90a-4dba-855a-9b51d2902f93';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('832988bc-5c1e-45b8-9a07-fa4abac4cf3b', '+201025183130', true, '2026-02-07 19:36:31', '2026-02-07 19:36:31', '834274b9-d90a-4dba-855a-9b51d2902f93') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201280720747', "PhoneNumberConfirmed" = true WHERE "Id" = '1481dbbc-3de1-4c07-8136-2f892a9d819d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('673d4891-2de6-400c-8b9a-3ffa107c66a1', '+201280720747', true, '2026-02-07 22:41:01', '2026-02-07 22:41:01', '1481dbbc-3de1-4c07-8136-2f892a9d819d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201207637780', "PhoneNumberConfirmed" = true WHERE "Id" = '110d87ed-885a-4f99-bc07-ff50dc4bf7cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e659f0fd-219f-4b5c-839d-5d5e85d39221', '+201207637780', true, '2026-02-12 19:29:30', '2026-02-12 19:29:30', '110d87ed-885a-4f99-bc07-ff50dc4bf7cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030999276', "PhoneNumberConfirmed" = true WHERE "Id" = '57de60e0-2d8d-4d15-9d8f-877a42c99043';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('590a23c2-f357-4896-b081-d3fc68c299d8', '+201030999276', true, '2026-02-07 10:52:27', '2026-02-07 10:52:27', '57de60e0-2d8d-4d15-9d8f-877a42c99043') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201553593869', "PhoneNumberConfirmed" = true WHERE "Id" = 'a6d16d84-8fda-47f3-afef-630866bd5cf8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a257cc66-5e31-4c0c-896c-76b483ef5c06', '+201553593869', true, '2026-02-16 20:42:02', '2026-02-16 20:42:02', 'a6d16d84-8fda-47f3-afef-630866bd5cf8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201281168726', "PhoneNumberConfirmed" = true WHERE "Id" = 'd4eb91fe-c847-4b86-b775-6b2c1287f16a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a2c7708c-1da4-4952-a473-ea52f6e1e11c', '+201281168726', true, '2025-11-10 12:55:25', '2025-11-10 12:55:25', 'd4eb91fe-c847-4b86-b775-6b2c1287f16a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201151106555', "PhoneNumberConfirmed" = true WHERE "Id" = '31220a91-caf9-4332-b306-48ad4c962c59';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b9d77663-efb1-45f6-951b-ed048a77bc0a', '+201151106555', true, '2025-12-16 14:15:38', '2025-12-16 14:15:38', '31220a91-caf9-4332-b306-48ad4c962c59') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01063513262', "PhoneNumberConfirmed" = true WHERE "Id" = 'beeadd72-ead4-4712-afae-f21325e4a85c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a3f314a2-2984-4abf-b0c5-bc6cf961557a', '01063513262', true, '2025-12-02 18:16:25', '2025-12-02 18:16:25', 'beeadd72-ead4-4712-afae-f21325e4a85c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01113319126', "PhoneNumberConfirmed" = true WHERE "Id" = 'e1ca5754-2be8-4e0d-ba84-427446e5a633';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('71792d47-2619-4700-8e33-2a60e246645a', '01113319126', true, '2025-12-17 20:57:42', '2025-12-17 20:57:42', 'e1ca5754-2be8-4e0d-ba84-427446e5a633') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201152996306', "PhoneNumberConfirmed" = true WHERE "Id" = '009a939d-e618-4d2a-a45a-83902aac83d5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dd44e36a-1fc3-47bf-8776-6bd3ee633cec', '+201152996306', true, '2025-12-22 11:29:32', '2025-12-22 11:29:32', '009a939d-e618-4d2a-a45a-83902aac83d5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201110861430', "PhoneNumberConfirmed" = true WHERE "Id" = 'c35d7af6-0703-4bf5-95ca-18fb646ac8ba';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('587502d2-d367-4ed1-89af-7aba495bb2b7', '+201110861430', true, '2025-12-30 16:48:38', '2025-12-30 16:48:38', 'c35d7af6-0703-4bf5-95ca-18fb646ac8ba') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091868898', "PhoneNumberConfirmed" = true WHERE "Id" = '88dccb61-707e-4a45-94c2-2d71afb168f7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2325303d-bdd5-4bc4-9550-14ce6220c213', '+201091868898', true, '2026-02-17 12:56:14', '2026-02-17 12:56:14', '88dccb61-707e-4a45-94c2-2d71afb168f7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201228630172', "PhoneNumberConfirmed" = true WHERE "Id" = 'a9b2ce3f-0676-4ad4-8af0-76d3cfe6148d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1db28d87-6369-40c9-9d78-7e0fb1526db5', '+201228630172', true, '2026-01-08 22:52:24', '2026-01-08 22:52:24', 'a9b2ce3f-0676-4ad4-8af0-76d3cfe6148d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201062218118', "PhoneNumberConfirmed" = true WHERE "Id" = 'bcafe06e-58b9-4749-a3eb-ba98c07facee';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dbc759cb-6465-4fe5-9f08-2901877e93be', '+201062218118', true, '2026-01-16 01:20:02', '2026-01-16 01:20:02', 'bcafe06e-58b9-4749-a3eb-ba98c07facee') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201234567890', "PhoneNumberConfirmed" = true WHERE "Id" = '2cdb886e-5f94-4bd5-b3a0-5ca316f2bef0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dd6580b9-afa1-45ba-965b-eaf16c0428e8', '+201234567890', true, '2026-01-17 11:29:07', '2026-01-17 11:29:07', '2cdb886e-5f94-4bd5-b3a0-5ca316f2bef0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022835939', "PhoneNumberConfirmed" = true WHERE "Id" = '4f18152c-0b87-4c34-84a8-39afc9c27944';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5105c033-77ef-4d14-8753-e262c0c00ce8', '+201022835939', true, '2026-01-19 00:27:03', '2026-01-19 00:27:03', '4f18152c-0b87-4c34-84a8-39afc9c27944') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201026860997', "PhoneNumberConfirmed" = true WHERE "Id" = '712a10ec-bf1c-4495-9ee4-580e5fe59b9d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b6494f49-a274-48b4-9413-1f4029d3ac36', '+201026860997', true, '2026-01-13 16:42:34', '2026-01-13 16:42:34', '712a10ec-bf1c-4495-9ee4-580e5fe59b9d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030490331', "PhoneNumberConfirmed" = true WHERE "Id" = 'bf2026a8-4a6f-4f95-97b4-c57723e4dfb9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('10aefb62-ab07-4072-ad9d-fae80981547d', '+201030490331', true, '2026-01-10 15:12:38', '2026-01-10 15:12:38', 'bf2026a8-4a6f-4f95-97b4-c57723e4dfb9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050551383', "PhoneNumberConfirmed" = true WHERE "Id" = '7f7228e6-bae0-4504-8f53-e9dc752d440e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a76e5a74-b752-4b9b-ae3f-c67c496e85e6', '+201050551383', true, '2026-02-05 14:49:20', '2026-02-05 14:49:20', '7f7228e6-bae0-4504-8f53-e9dc752d440e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201276216734', "PhoneNumberConfirmed" = true WHERE "Id" = 'a80630ae-ba1c-4a66-91c2-a638a9641549';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d4331742-fcad-425d-86af-7dbca26bc14a', '+201276216734', true, '2026-05-18 01:05:30', '2026-05-18 01:05:30', 'a80630ae-ba1c-4a66-91c2-a638a9641549') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201063401992', "PhoneNumberConfirmed" = true WHERE "Id" = 'aee7feee-c52e-42a9-bb45-bf169bb9be9c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5bb129a7-b68c-410a-9bc2-51c27a2c2cca', '+201063401992', true, '2026-01-26 00:31:20', '2026-01-26 00:31:20', 'aee7feee-c52e-42a9-bb45-bf169bb9be9c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201114187692', "PhoneNumberConfirmed" = true WHERE "Id" = '22de7708-21c6-4921-a85f-2a4555fcc511';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7dbd60d9-6add-4790-9fad-2605a2bbdfcd', '+201114187692', true, '2026-02-04 14:27:14', '2026-02-04 14:27:14', '22de7708-21c6-4921-a85f-2a4555fcc511') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201069008667', "PhoneNumberConfirmed" = true WHERE "Id" = 'efc220b4-d882-4ada-88e9-db0e382e84fc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('83456792-0140-451a-bfc4-228cd0f5875a', '+201069008667', true, '2026-02-06 06:20:59', '2026-02-06 06:20:59', 'efc220b4-d882-4ada-88e9-db0e382e84fc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201157154057', "PhoneNumberConfirmed" = true WHERE "Id" = '162d6afc-137e-45be-b570-90bf566f9907';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4ff9be4c-9c3d-43ba-9e17-2002ac367af7', '+201157154057', true, '2026-04-12 21:55:56', '2026-04-12 21:55:56', '162d6afc-137e-45be-b570-90bf566f9907') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066867438', "PhoneNumberConfirmed" = true WHERE "Id" = 'd0b39f11-7bba-4716-8bb3-5ff8d97023fc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1843f1ff-4577-4759-86b6-74099f2aaa4b', '+201066867438', true, '2026-02-06 08:51:16', '2026-02-06 08:51:16', 'd0b39f11-7bba-4716-8bb3-5ff8d97023fc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201068445380', "PhoneNumberConfirmed" = true WHERE "Id" = '62ef4611-51a4-49be-a937-796fedfe3e75';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('16c59537-22ca-471f-82f1-464c413a7138', '+201068445380', true, '2026-02-06 16:58:08', '2026-02-06 16:58:08', '62ef4611-51a4-49be-a937-796fedfe3e75') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229632585', "PhoneNumberConfirmed" = true WHERE "Id" = 'c1712a82-a054-480b-9921-2c4a74a87ce7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d7a9a7d0-7c9d-45b7-8aaf-342a70bddddf', '+201229632585', true, '2026-02-13 00:19:58', '2026-02-13 00:19:58', 'c1712a82-a054-480b-9921-2c4a74a87ce7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966533964255', "PhoneNumberConfirmed" = true WHERE "Id" = 'a1076588-b2ea-4291-8293-46d6586fdb69';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9a2decbf-8dca-44fe-8dd0-ba6540d4b07a', '+966533964255', true, '2025-11-11 10:12:13', '2025-11-11 10:12:13', 'a1076588-b2ea-4291-8293-46d6586fdb69') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201124616101', "PhoneNumberConfirmed" = true WHERE "Id" = '24e91e5f-baca-416d-ac16-2967112b4e21';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d0794b13-1bf8-4e36-a936-0b6ad7752506', '+201124616101', true, '2025-11-10 14:12:00', '2025-11-10 14:12:00', '24e91e5f-baca-416d-ac16-2967112b4e21') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01019630328', "PhoneNumberConfirmed" = true WHERE "Id" = '82b7bbc2-cc76-4d5a-9f05-94f9a7c00f9d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bba8dc9c-b469-49dc-98be-3e23b48b7330', '01019630328', true, '2025-12-02 18:24:29', '2025-12-02 18:24:29', '82b7bbc2-cc76-4d5a-9f05-94f9a7c00f9d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092113813', "PhoneNumberConfirmed" = true WHERE "Id" = '30479f58-9a5f-4b65-adf4-a0142e9ce376';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ddc918ee-824a-45ac-8bde-55307efb044e', '+201092113813', true, '2025-12-22 14:16:48', '2025-12-22 14:16:48', '30479f58-9a5f-4b65-adf4-a0142e9ce376') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201110840508', "PhoneNumberConfirmed" = true WHERE "Id" = 'c754d009-197d-49d0-821d-ea51a19afa35';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('be73bead-2cab-4895-b1dc-48243a35e289', '+201110840508', true, '2025-12-16 17:02:25', '2025-12-16 17:02:25', 'c754d009-197d-49d0-821d-ea51a19afa35') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201281305813', "PhoneNumberConfirmed" = true WHERE "Id" = '9522b0d0-2364-4430-a162-1e96ffe193bb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('05f37cd7-4c3b-4e84-85fe-c3734f9c2d87', '+201281305813', true, '2025-12-06 08:15:51', '2025-12-06 08:15:51', '9522b0d0-2364-4430-a162-1e96ffe193bb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201210059039', "PhoneNumberConfirmed" = true WHERE "Id" = 'c8580d2c-e6e6-41a5-9add-e0c359bacdfe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('aef1f5e5-690e-4bef-b066-fcddd4971223', '+201210059039', true, '2025-12-19 20:14:25', '2025-12-19 20:14:25', 'c8580d2c-e6e6-41a5-9add-e0c359bacdfe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201278736909', "PhoneNumberConfirmed" = true WHERE "Id" = '06449de5-9e6c-43ad-a331-befaec032abe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8da424f1-6afc-495c-8f7a-0df39cc7b8b8', '+201278736909', true, '2025-12-30 17:09:53', '2025-12-30 17:09:53', '06449de5-9e6c-43ad-a331-befaec032abe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01272972460', "PhoneNumberConfirmed" = true WHERE "Id" = 'a467d82d-3892-462e-95c5-41b4d335ce11';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('37ef5bef-8eaf-4985-bf09-500843f9149e', '01272972460', true, '2026-01-01 12:16:03', '2026-01-01 12:16:03', 'a467d82d-3892-462e-95c5-41b4d335ce11') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01507004009', "PhoneNumberConfirmed" = true WHERE "Id" = '7043af24-1481-4cab-a225-e832369b91ac';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2e7caf38-aa0f-4ae0-a114-bd4b753f7207', '01507004009', true, '2026-01-08 23:05:45', '2026-01-08 23:05:45', '7043af24-1481-4cab-a225-e832369b91ac') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01226092508', "PhoneNumberConfirmed" = true WHERE "Id" = 'd201a4e5-548f-4493-b2b0-3b2174e8d3ad';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dc4327b5-fe3c-45e4-b530-b87f0e20f2ef', '01226092508', true, '2025-12-17 21:37:38', '2025-12-17 21:37:38', 'd201a4e5-548f-4493-b2b0-3b2174e8d3ad') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092460011', "PhoneNumberConfirmed" = true WHERE "Id" = '45f24d68-afc0-4fa9-a90d-da54251fdd1f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2ec56e97-c944-47f8-8cf1-344dff9813e3', '+201092460011', true, '2026-02-04 14:35:03', '2026-02-04 14:35:03', '45f24d68-afc0-4fa9-a90d-da54251fdd1f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067118599', "PhoneNumberConfirmed" = true WHERE "Id" = '0ff8c1a5-98fe-4bd5-b6ff-347c6bcee2fd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('262eb831-d4e7-4401-89f9-8fc587bafc50', '+201067118599', true, '2026-01-12 11:13:16', '2026-01-12 11:13:16', '0ff8c1a5-98fe-4bd5-b6ff-347c6bcee2fd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064954622', "PhoneNumberConfirmed" = true WHERE "Id" = 'fe7c7c11-9101-456d-b379-edad5b3947c5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ce18df72-cda9-4253-8ddd-8dc277abcc55', '+201064954622', true, '2026-01-13 16:55:01', '2026-01-13 16:55:01', 'fe7c7c11-9101-456d-b379-edad5b3947c5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201029026340', "PhoneNumberConfirmed" = true WHERE "Id" = '728d9858-9f30-45e7-bfeb-dbb58254edb6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a7836d46-a7d8-4373-a67f-3aa321c9e04c', '+201029026340', true, '2026-02-05 15:03:17', '2026-02-05 15:03:17', '728d9858-9f30-45e7-bfeb-dbb58254edb6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201287629733', "PhoneNumberConfirmed" = true WHERE "Id" = '1a45e4d6-6f9e-4678-9671-3ee245730581';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ef284b8f-9971-437d-986f-e813339de103', '+201287629733', true, '2026-01-19 07:01:49', '2026-01-19 07:01:49', '1a45e4d6-6f9e-4678-9671-3ee245730581') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001855562', "PhoneNumberConfirmed" = true WHERE "Id" = '7d4e78ac-29a0-4722-9517-e450b43311a2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('705014c4-3d96-4693-abfd-469727773e51', '+201001855562', true, '2026-02-04 17:50:18', '2026-02-04 17:50:18', '7d4e78ac-29a0-4722-9517-e450b43311a2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201557681777', "PhoneNumberConfirmed" = true WHERE "Id" = '0e5b51c1-342c-4553-ae32-5be1f30bd6bf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d1371c27-5165-490a-bb07-fcf84f7071c4', '+201557681777', true, '2026-02-07 14:57:17', '2026-02-07 14:57:17', '0e5b51c1-342c-4553-ae32-5be1f30bd6bf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201055860581', "PhoneNumberConfirmed" = true WHERE "Id" = 'b889b45c-bb06-4208-b59c-f0caaeca539c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5db1cbc6-6605-42a8-afd5-3cfbf6c1cf9a', '+201055860581', true, '2026-01-26 00:46:42', '2026-01-26 00:46:42', 'b889b45c-bb06-4208-b59c-f0caaeca539c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201128293004', "PhoneNumberConfirmed" = true WHERE "Id" = 'fad5373d-f02f-4a4d-94ea-7e3f1cde3bd9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f2af1062-6044-4642-b2cb-82029e9fad7f', '+201128293004', true, '2026-02-03 17:06:45', '2026-02-03 17:06:45', 'fad5373d-f02f-4a4d-94ea-7e3f1cde3bd9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201280354574', "PhoneNumberConfirmed" = true WHERE "Id" = '5566f799-ff39-40ea-af9c-8a30581cc457';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('65339272-35de-4d32-9a0c-f8f1bccb5ef1', '+201280354574', true, '2026-02-07 18:20:51', '2026-02-07 18:20:51', '5566f799-ff39-40ea-af9c-8a30581cc457') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201020318660', "PhoneNumberConfirmed" = true WHERE "Id" = 'cb515011-ba20-4c02-ba2b-19faaf8b61d3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c24c99cb-dc25-4fef-bc2e-7f7e498d80aa', '+201020318660', true, '2026-02-07 19:51:12', '2026-02-07 19:51:12', 'cb515011-ba20-4c02-ba2b-19faaf8b61d3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201555560522', "PhoneNumberConfirmed" = true WHERE "Id" = '97ab7c76-e68e-48c6-b5c2-f7f7030d097f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a0af847f-01b8-42ca-9387-40eb30f3fda0', '+201555560522', true, '2026-02-07 23:10:57', '2026-02-07 23:10:57', '97ab7c76-e68e-48c6-b5c2-f7f7030d097f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201226505661', "PhoneNumberConfirmed" = true WHERE "Id" = 'deb0957c-5904-445f-8225-c041294f3240';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('71b5e722-c303-4757-92f7-0ad974d3cb97', '+201226505661', true, '2026-05-18 23:29:22', '2026-05-18 23:29:22', 'deb0957c-5904-445f-8225-c041294f3240') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061492213', "PhoneNumberConfirmed" = true WHERE "Id" = 'b1a819d7-6aa9-44d8-a740-5e25f57c507a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d6933a2d-ee83-496d-9a1f-7c453781a16b', '+201061492213', true, '2026-04-24 20:45:50', '2026-04-24 20:45:50', 'b1a819d7-6aa9-44d8-a740-5e25f57c507a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01105700155', "PhoneNumberConfirmed" = true WHERE "Id" = '27a21499-673e-4cf4-9fbd-80ef77a2b919';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2ff891b5-028a-4894-b940-86cdf2199586', '01105700155', true, '2025-12-02 18:34:41', '2025-12-02 18:34:41', '27a21499-673e-4cf4-9fbd-80ef77a2b919') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201009338842', "PhoneNumberConfirmed" = true WHERE "Id" = '013b8e60-90a8-4655-9f7a-a7f5a1e1396d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5e3b62d9-bce2-4575-9dd5-ec9ef47d8ba9', '+201009338842', true, '2025-11-14 12:59:59', '2025-11-14 12:59:59', '013b8e60-90a8-4655-9f7a-a7f5a1e1396d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+3901145498901', "PhoneNumberConfirmed" = true WHERE "Id" = 'aa48686a-9b6f-40d1-baff-728e0d2655e3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2aa20c82-5c9c-40be-87fa-22ff3d7f9c48', '+3901145498901', true, '2025-12-16 17:12:55', '2025-12-16 17:12:55', 'aa48686a-9b6f-40d1-baff-728e0d2655e3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022725742', "PhoneNumberConfirmed" = true WHERE "Id" = '5bb289f4-a9e2-438d-b33b-15ee006d86ba';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2468c1d9-fee2-471a-a400-375ef2fffa7a', '+201022725742', true, '2025-12-18 01:06:05', '2025-12-18 01:06:05', '5bb289f4-a9e2-438d-b33b-15ee006d86ba') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+20155128659', "PhoneNumberConfirmed" = true WHERE "Id" = 'da3f7d99-6a5e-4a7f-8395-7d3c1fcd84ce';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1e92b8d9-fdc0-4f8d-afd1-ef1c4ec6004f', '+20155128659', true, '2025-12-22 16:21:52', '2025-12-22 16:21:52', 'da3f7d99-6a5e-4a7f-8395-7d3c1fcd84ce') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050448670', "PhoneNumberConfirmed" = true WHERE "Id" = 'fad14edf-a06f-4be0-bf63-be1f7df71bf6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a8cc2210-d1a3-4226-b05c-8f351d4899f0', '+201050448670', true, '2025-12-19 20:38:48', '2025-12-19 20:38:48', 'fad14edf-a06f-4be0-bf63-be1f7df71bf6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201273226557', "PhoneNumberConfirmed" = true WHERE "Id" = '5a1599dd-d615-4666-98d6-813b4ca2be16';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6aabb29d-11cb-4ffc-9fdb-88cd41c8de83', '+201273226557', true, '2025-12-30 22:12:32', '2025-12-30 22:12:32', '5a1599dd-d615-4666-98d6-813b4ca2be16') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201552678050', "PhoneNumberConfirmed" = true WHERE "Id" = '8d2e22a6-4ad8-43ac-8424-b87c96e5125d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3bb69e89-247a-4281-9c6a-a2306226ab48', '+201552678050', true, '2026-01-09 03:21:42', '2026-01-09 03:21:42', '8d2e22a6-4ad8-43ac-8424-b87c96e5125d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002227609', "PhoneNumberConfirmed" = true WHERE "Id" = '85faaffe-180e-473c-b446-a57b98778b71';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3fb81c76-d996-4604-a682-d72df4ddfd89', '+201002227609', true, '2026-01-12 12:09:19', '2026-01-12 12:09:19', '85faaffe-180e-473c-b446-a57b98778b71') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201112208866', "PhoneNumberConfirmed" = true WHERE "Id" = 'e34c1010-9a68-41f8-b8ba-f522c8d54883';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('119f7da0-fdd4-4664-b165-e6a7fda0becc', '+201112208866', true, '2026-02-05 15:19:18', '2026-02-05 15:19:18', 'e34c1010-9a68-41f8-b8ba-f522c8d54883') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050310024', "PhoneNumberConfirmed" = true WHERE "Id" = 'f539ee3e-36af-4809-abfc-0fb8dd0078d3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c953b008-0669-433d-80f9-d17f90c75e1e', '+201050310024', true, '2026-01-17 16:39:15', '2026-01-17 16:39:15', 'f539ee3e-36af-4809-abfc-0fb8dd0078d3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201068994836', "PhoneNumberConfirmed" = true WHERE "Id" = '18ca6fcb-55d9-40a7-9ca3-230b7bdb65d3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('06979021-0cdf-498f-b9c7-2bb7edfa225b', '+201068994836', true, '2026-01-13 17:41:05', '2026-01-13 17:41:05', '18ca6fcb-55d9-40a7-9ca3-230b7bdb65d3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090895904', "PhoneNumberConfirmed" = true WHERE "Id" = '8d91eb10-e6cf-4bff-a1d5-7f171df7a50b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3cbf52e0-e766-4520-8de9-ee869af056cc', '+201090895904', true, '2026-01-19 07:38:04', '2026-01-19 07:38:04', '8d91eb10-e6cf-4bff-a1d5-7f171df7a50b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213781884636', "PhoneNumberConfirmed" = true WHERE "Id" = 'a346a49b-1cbd-4fd7-9741-c61ea3957256';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f1e82f8f-1b7e-424e-af92-1e39cf5e2ac3', '+213781884636', true, '2026-02-11 23:02:26', '2026-02-11 23:02:26', 'a346a49b-1cbd-4fd7-9741-c61ea3957256') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201225364253', "PhoneNumberConfirmed" = true WHERE "Id" = 'ee219705-8f0d-4923-afb4-e8c114a619bc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2c3be377-0f09-44ca-83ca-12c187428e88', '+201225364253', true, '2026-02-11 18:30:07', '2026-02-11 18:30:07', 'ee219705-8f0d-4923-afb4-e8c114a619bc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201159745706', "PhoneNumberConfirmed" = true WHERE "Id" = '78aec462-7db6-4ac3-a06f-9f6d74c8b29a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bfbaef72-3160-4d37-89a1-462778b03fb8', '+201159745706', true, '2026-01-10 18:08:32', '2026-01-10 18:08:32', '78aec462-7db6-4ac3-a06f-9f6d74c8b29a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201200027374', "PhoneNumberConfirmed" = true WHERE "Id" = '1d82fb55-dc2b-4051-b6a7-40601b882115';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9bee3f3b-c92a-47de-afa7-98b88e5a15ac', '+201200027374', true, '2026-02-07 15:14:49', '2026-02-07 15:14:49', '1d82fb55-dc2b-4051-b6a7-40601b882115') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+12345678910', "PhoneNumberConfirmed" = true WHERE "Id" = '271fb6cd-a20e-4e5a-9f4b-9b7b32985bd7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('626f10b7-c15b-4cbe-b641-d1c72926fa71', '+12345678910', true, '2026-02-06 09:08:02', '2026-02-06 09:08:02', '271fb6cd-a20e-4e5a-9f4b-9b7b32985bd7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201226630301', "PhoneNumberConfirmed" = true WHERE "Id" = '43d6307c-7606-4726-a5c4-2c877e0c01c0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('33f14d37-b6bd-49f8-b859-ffd8fbe17a0e', '+201226630301', true, '2026-02-06 13:45:33', '2026-02-06 13:45:33', '43d6307c-7606-4726-a5c4-2c877e0c01c0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201201928937', "PhoneNumberConfirmed" = true WHERE "Id" = '78981768-07cb-40b0-928b-1bbfccc8f9a8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6b1faaed-20be-4718-96b4-6e49c93d558d', '+201201928937', true, '2026-02-08 22:17:12', '2026-02-08 22:17:12', '78981768-07cb-40b0-928b-1bbfccc8f9a8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223968004', "PhoneNumberConfirmed" = true WHERE "Id" = '79186075-84dd-4afd-8ff7-8b3c3f2cd105';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4e94c71d-6e92-4dde-abf7-0461bfe86c98', '+201223968004', true, '2026-02-06 15:10:10', '2026-02-06 15:10:10', '79186075-84dd-4afd-8ff7-8b3c3f2cd105') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201142479985', "PhoneNumberConfirmed" = true WHERE "Id" = '368506cf-26a4-4b22-bfde-016489602012';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('37c7e1da-07b9-403f-84b3-386767933c10', '+201142479985', true, '2026-02-08 12:27:13', '2026-02-08 12:27:13', '368506cf-26a4-4b22-bfde-016489602012') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201094216186', "PhoneNumberConfirmed" = true WHERE "Id" = '59fd88db-aa88-48f0-a7f4-f5c556e09894';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('251616ae-47a4-4102-a7e0-1fa1a8cf02f4', '+201094216186', true, '2026-04-26 20:58:52', '2026-04-26 20:58:52', '59fd88db-aa88-48f0-a7f4-f5c556e09894') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01022576062', "PhoneNumberConfirmed" = true WHERE "Id" = '8940b98e-ae81-43a9-8e71-6a4d5a4a0afe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dc9368d8-e910-4085-8718-b94fc1b02897', '01022576062', true, '2025-12-16 17:14:01', '2025-12-16 17:14:01', '8940b98e-ae81-43a9-8e71-6a4d5a4a0afe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201148441689', "PhoneNumberConfirmed" = true WHERE "Id" = 'e3a5d33a-9825-4798-80b8-71f59bee131a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0cdf8d23-2370-432f-bc40-6b168ee040de', '+201148441689', true, '2025-12-22 17:16:26', '2025-12-22 17:16:26', 'e3a5d33a-9825-4798-80b8-71f59bee131a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201150568045', "PhoneNumberConfirmed" = true WHERE "Id" = 'c64e0ddc-f1f0-4192-a189-77b4787d7ab6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fe1f0c41-1fd7-475a-a0f2-7b4b89b9dce7', '+201150568045', true, '2025-12-19 22:11:22', '2025-12-19 22:11:22', 'c64e0ddc-f1f0-4192-a189-77b4787d7ab6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201113355145', "PhoneNumberConfirmed" = true WHERE "Id" = '5075f3e6-3ca4-484d-a806-9923d4880f6f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c91d49d9-77ab-4dda-9342-0d12d154e6a6', '+201113355145', true, '2025-12-31 00:54:22', '2025-12-31 00:54:22', '5075f3e6-3ca4-484d-a806-9923d4880f6f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201005811381', "PhoneNumberConfirmed" = true WHERE "Id" = '630b739f-b642-4723-a505-9b4bcb3423a7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0785678f-8c59-4a83-a542-121beab7d794', '+201005811381', true, '2026-01-09 07:18:39', '2026-01-09 07:18:39', '630b739f-b642-4723-a505-9b4bcb3423a7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201273553337', "PhoneNumberConfirmed" = true WHERE "Id" = 'e360bd10-314d-4e86-9a14-9adcaa12a473';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('363b86c5-a912-4ca8-b35a-069c1da42cf5', '+201273553337', true, '2026-01-01 15:35:30', '2026-01-01 15:35:30', 'e360bd10-314d-4e86-9a14-9adcaa12a473') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201285196684', "PhoneNumberConfirmed" = true WHERE "Id" = 'bc07015c-b54c-4199-9180-7d4cbbce46c0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b0e703d1-4143-48f9-8e18-44a18e66056d', '+201285196684', true, '2025-11-11 16:33:12', '2025-11-11 16:33:12', 'bc07015c-b54c-4199-9180-7d4cbbce46c0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01022725742', "PhoneNumberConfirmed" = true WHERE "Id" = '90d93e6c-66ac-4801-b034-3e0c3ceb4abb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f7536d26-77f8-4126-b0d9-1ec90644da0e', '01022725742', true, '2025-12-02 19:15:05', '2025-12-02 19:15:05', '90d93e6c-66ac-4801-b034-3e0c3ceb4abb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201254546554', "PhoneNumberConfirmed" = true WHERE "Id" = '800428a3-88cd-4c24-a102-8f5070dbee5d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3a59b951-7560-4feb-a698-e7c9d365da0a', '+201254546554', true, '2026-01-30 21:09:05', '2026-01-30 21:09:05', '800428a3-88cd-4c24-a102-8f5070dbee5d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091154009', "PhoneNumberConfirmed" = true WHERE "Id" = 'ba281fcc-9390-47aa-9692-8647961da60b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('afe0d2c0-aa0d-4b92-ac9e-e5152f5ea3fb', '+201091154009', true, '2026-01-12 12:17:57', '2026-01-12 12:17:57', 'ba281fcc-9390-47aa-9692-8647961da60b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021291181', "PhoneNumberConfirmed" = true WHERE "Id" = '11969f23-40b4-481f-950d-b875a9ae0689';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2ef19dc4-1ab6-4c2e-918c-7c254145b75d', '+201021291181', true, '2026-01-13 17:51:50', '2026-01-13 17:51:50', '11969f23-40b4-481f-950d-b875a9ae0689') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201013229862', "PhoneNumberConfirmed" = true WHERE "Id" = 'dea57a5d-f263-437b-ac30-ae5ac7a66878';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cfe417ab-070b-4bd8-a824-2f5a05280682', '+201013229862', true, '2026-01-12 10:37:05', '2026-01-12 10:37:05', 'dea57a5d-f263-437b-ac30-ae5ac7a66878') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001718378', "PhoneNumberConfirmed" = true WHERE "Id" = '7e8a241b-4624-491d-bbcc-87a27b2b00d9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('25ebee96-ec18-4388-beb2-a79933334636', '+201001718378', true, '2026-02-04 21:36:27', '2026-02-04 21:36:27', '7e8a241b-4624-491d-bbcc-87a27b2b00d9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060796518', "PhoneNumberConfirmed" = true WHERE "Id" = 'a27a83ee-f08d-4863-a8da-156883532ab9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f0cdda37-8585-44fa-8d6e-0741c6477e88', '+201060796518', true, '2026-02-05 15:19:52', '2026-02-05 15:19:52', 'a27a83ee-f08d-4863-a8da-156883532ab9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201220416443', "PhoneNumberConfirmed" = true WHERE "Id" = 'c4ff19bd-7bf7-4e95-885a-ea2330b5313e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1978e612-c19b-40b0-a0f4-5474bcb60502', '+201220416443', true, '2026-02-09 20:57:20', '2026-02-09 20:57:20', 'c4ff19bd-7bf7-4e95-885a-ea2330b5313e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019933503', "PhoneNumberConfirmed" = true WHERE "Id" = 'd2877854-3072-4041-8a53-8297be6d26cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('044c4598-ac37-4074-9a62-e2497aaf37b0', '+201019933503', true, '2026-01-19 08:40:25', '2026-01-19 08:40:25', 'd2877854-3072-4041-8a53-8297be6d26cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201115232077', "PhoneNumberConfirmed" = true WHERE "Id" = '9b27b041-98f5-48f6-a4a9-303e5b847059';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c654c3bc-38aa-485e-911a-ad835ed72dc7', '+201115232077', true, '2026-02-06 13:55:14', '2026-02-06 13:55:14', '9b27b041-98f5-48f6-a4a9-303e5b847059') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201150775906', "PhoneNumberConfirmed" = true WHERE "Id" = '492c3367-427d-419d-977c-78124fcb4a34';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('54b5ddb4-7b2d-4172-89d2-9d4707897c13', '+201150775906', true, '2026-02-07 23:25:23', '2026-02-07 23:25:23', '492c3367-427d-419d-977c-78124fcb4a34') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01212444429', "PhoneNumberConfirmed" = true WHERE "Id" = 'f58ae2a2-bb74-4fb1-9c98-28f8b98d821e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ecbf9666-c4c5-4bcc-83cf-b42412edbf36', '01212444429', true, '2026-02-09 08:35:29', '2026-02-09 08:35:29', 'f58ae2a2-bb74-4fb1-9c98-28f8b98d821e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222701194', "PhoneNumberConfirmed" = true WHERE "Id" = 'cebf03b7-c4d4-4c36-9920-9f16355ffc06';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fe63c46e-9375-4d3c-adf7-4e327514b17c', '+201222701194', true, '2026-04-29 15:24:39', '2026-04-29 15:24:39', 'cebf03b7-c4d4-4c36-9920-9f16355ffc06') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201128987530', "PhoneNumberConfirmed" = true WHERE "Id" = '212360d1-165b-4f46-9744-fd8a35ab1ad8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ccd8f494-c2ad-4214-9220-424c5f156d3d', '+201128987530', true, '2025-11-11 17:05:44', '2025-11-11 17:05:44', '212360d1-165b-4f46-9744-fd8a35ab1ad8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201124011983', "PhoneNumberConfirmed" = true WHERE "Id" = '4565d328-3b66-48db-8255-82dd7fad97cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b59b60e5-d3f0-440b-ab5f-8cd9c92be804', '+201124011983', true, '2025-12-02 19:45:12', '2025-12-02 19:45:12', '4565d328-3b66-48db-8255-82dd7fad97cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201113367470', "PhoneNumberConfirmed" = true WHERE "Id" = '788f5840-c905-4db7-8342-c7f28877ca88';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c4d8e184-6125-4d91-a360-522b64a365d6', '+201113367470', true, '2025-09-27 23:48:21', '2025-09-27 23:48:21', '788f5840-c905-4db7-8342-c7f28877ca88') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201097313942', "PhoneNumberConfirmed" = true WHERE "Id" = 'e1e23ce1-29df-4b48-b816-42200e09d2be';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6e434b05-0291-45b4-9412-37ec803bcba5', '+201097313942', true, '2025-12-22 17:55:39', '2025-12-22 17:55:39', 'e1e23ce1-29df-4b48-b816-42200e09d2be') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201227984311', "PhoneNumberConfirmed" = true WHERE "Id" = 'a6bd3ba2-21d4-4d94-b89a-16b3b70f7cb1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a06f8209-e256-4938-966d-3c0d8d15bae6', '+201227984311', true, '2025-12-31 00:58:00', '2025-12-31 00:58:00', 'a6bd3ba2-21d4-4d94-b89a-16b3b70f7cb1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060317731', "PhoneNumberConfirmed" = true WHERE "Id" = '6784da1d-07e3-4b23-9d75-be69559d8c14';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('293ea2a0-111e-47a8-8af8-a08c764adaa6', '+201060317731', true, '2025-12-18 14:11:35', '2025-12-18 14:11:35', '6784da1d-07e3-4b23-9d75-be69559d8c14') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201126550760', "PhoneNumberConfirmed" = true WHERE "Id" = 'c29ffebb-3644-4809-8aa7-2457803ed5f5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3f99463f-9e2a-4f99-bd9d-328ced427438', '+201126550760', true, '2026-01-10 20:54:32', '2026-01-10 20:54:32', 'c29ffebb-3644-4809-8aa7-2457803ed5f5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201555133349', "PhoneNumberConfirmed" = true WHERE "Id" = '2d2bae5d-b19f-4747-b4fe-4c3faffd1c57';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c9fa8680-04b4-42b8-95e0-77fbc21e410d', '+201555133349', true, '2026-01-12 13:36:42', '2026-01-12 13:36:42', '2d2bae5d-b19f-4747-b4fe-4c3faffd1c57') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201068075343', "PhoneNumberConfirmed" = true WHERE "Id" = 'a9c69eef-0543-432b-98e8-6f8b525ae2c8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1266cff9-703a-4aea-ac1f-109b18356422', '+201068075343', true, '2026-01-17 20:36:56', '2026-01-17 20:36:56', 'a9c69eef-0543-432b-98e8-6f8b525ae2c8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201115835875', "PhoneNumberConfirmed" = true WHERE "Id" = '94e4d8e6-84cd-4bab-a30f-e6fd812922b5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7ad37a84-84c0-439c-8d6f-1f06b96554d9', '+201115835875', true, '2026-01-09 11:28:55', '2026-01-09 11:28:55', '94e4d8e6-84cd-4bab-a30f-e6fd812922b5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201141920486', "PhoneNumberConfirmed" = true WHERE "Id" = '776f1770-239c-4f7f-9331-b7eb8dd351c4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('969d7fc8-db4f-4072-babe-d76c3ffd6d55', '+201141920486', true, '2026-01-13 18:51:47', '2026-01-13 18:51:47', '776f1770-239c-4f7f-9331-b7eb8dd351c4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201284558778', "PhoneNumberConfirmed" = true WHERE "Id" = 'c7607e92-980c-449b-b2eb-62874ed68061';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4749d6b7-b8bc-4935-b59c-2aea0371876a', '+201284558778', true, '2026-01-30 21:30:13', '2026-01-30 21:30:13', 'c7607e92-980c-449b-b2eb-62874ed68061') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021060374', "PhoneNumberConfirmed" = true WHERE "Id" = '20a19a95-2785-468a-91a4-73e71d19843f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f29840ab-6329-4a76-9035-22616e8605e3', '+201021060374', true, '2026-01-19 11:11:10', '2026-01-19 11:11:10', '20a19a95-2785-468a-91a4-73e71d19843f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201154454128', "PhoneNumberConfirmed" = true WHERE "Id" = '8de3fccc-98e3-4367-ab1e-789c775e43e9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('93a31240-c430-4239-ae1e-6f1f8cbeb1ec', '+201154454128', true, '2026-02-07 18:38:33', '2026-02-07 18:38:33', '8de3fccc-98e3-4367-ab1e-789c775e43e9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201011477393', "PhoneNumberConfirmed" = true WHERE "Id" = '3a657713-729d-49e7-be1c-bbbcc0b00821';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a7353401-959f-46b8-a1a2-0f63e98e6a5f', '+201011477393', true, '2026-01-16 12:49:54', '2026-01-16 12:49:54', '3a657713-729d-49e7-be1c-bbbcc0b00821') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002632525', "PhoneNumberConfirmed" = true WHERE "Id" = '492a9115-d74d-4f08-8f03-243c61472bc5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b3d25d0e-9d78-46f8-8cef-4aa3035a59e6', '+201002632525', true, '2026-02-06 12:20:01', '2026-02-06 12:20:01', '492a9115-d74d-4f08-8f03-243c61472bc5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201093929339', "PhoneNumberConfirmed" = true WHERE "Id" = '551c2d40-5dd8-478f-9665-3fcc33e012d5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0a51eb5e-f553-43dc-92b7-f6249888bbcf', '+201093929339', true, '2026-02-06 15:21:09', '2026-02-06 15:21:09', '551c2d40-5dd8-478f-9665-3fcc33e012d5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002412525', "PhoneNumberConfirmed" = true WHERE "Id" = '840fe042-f27b-4734-8bdb-30679273abb9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f03e96dd-4fdf-4db7-82ef-42e9e9699cb7', '+201002412525', true, '2026-02-06 09:36:51', '2026-02-06 09:36:51', '840fe042-f27b-4734-8bdb-30679273abb9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201281219090', "PhoneNumberConfirmed" = true WHERE "Id" = 'ef265557-d4ee-42f5-98e5-dc584a3c88e9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a72c576d-4f43-4f8e-99a7-43b35feea045', '+201281219090', true, '2026-02-06 18:07:49', '2026-02-06 18:07:49', 'ef265557-d4ee-42f5-98e5-dc584a3c88e9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201011306031', "PhoneNumberConfirmed" = true WHERE "Id" = 'af028537-8c97-42d3-a0e2-f391954be2c8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('15be9f74-b91a-4759-9f4d-b1ec0539170b', '+201011306031', true, '2026-04-30 10:44:30', '2026-04-30 10:44:30', 'af028537-8c97-42d3-a0e2-f391954be2c8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061338105', "PhoneNumberConfirmed" = true WHERE "Id" = 'd1435293-68df-45a9-bee5-cfa73c5749ed';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4bd8db1a-f306-4c25-be69-acca6d98b91a', '+201061338105', true, '2025-11-11 18:01:43', '2025-11-11 18:01:43', 'd1435293-68df-45a9-bee5-cfa73c5749ed') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030459415', "PhoneNumberConfirmed" = true WHERE "Id" = '5e914a67-4644-4476-9f65-3382698a21bd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('62bee93f-43d3-4156-a9e2-cfbfdec444e5', '+201030459415', true, '2026-05-28 14:11:02', '2026-05-28 14:11:02', '5e914a67-4644-4476-9f65-3382698a21bd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201285283388', "PhoneNumberConfirmed" = true WHERE "Id" = '767077ef-0714-41ce-9f7c-974f0ca74a8e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('430c4bb7-45f5-4d0b-b7cd-5f501df773b3', '+201285283388', true, '2026-01-13 20:10:16', '2026-01-13 20:10:16', '767077ef-0714-41ce-9f7c-974f0ca74a8e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01552790745', "PhoneNumberConfirmed" = true WHERE "Id" = 'f840f28b-8534-4fb2-a0be-62e34e82560d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9bde3e50-8b60-4a43-af02-896155bd1ccb', '01552790745', true, '2025-12-02 21:24:22', '2025-12-02 21:24:22', 'f840f28b-8534-4fb2-a0be-62e34e82560d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222389888', "PhoneNumberConfirmed" = true WHERE "Id" = '2bea28f6-377b-46bc-bde5-41133b87a3bc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b60344c9-f516-4648-bce5-7631e94b6695', '+201222389888', true, '2026-01-01 16:19:22', '2026-01-01 16:19:22', '2bea28f6-377b-46bc-bde5-41133b87a3bc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01284556747', "PhoneNumberConfirmed" = true WHERE "Id" = '077a9a47-f84a-41b5-ac4e-37e5ec4dc995';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c4a08495-dbe3-471e-8ef9-302b32337742', '01284556747', true, '2025-12-20 01:13:12', '2025-12-20 01:13:12', '077a9a47-f84a-41b5-ac4e-37e5ec4dc995') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229554102', "PhoneNumberConfirmed" = true WHERE "Id" = '982bfb89-a020-4a26-a69d-683130e6e6ff';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('deac5824-393e-4c0f-b414-173b709c5b5a', '+201229554102', true, '2025-12-18 14:13:05', '2025-12-18 14:13:05', '982bfb89-a020-4a26-a69d-683130e6e6ff') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067878035', "PhoneNumberConfirmed" = true WHERE "Id" = '892e70e5-b656-455e-a7f1-7945cb38bcc9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('99e622c3-500c-49f3-be52-b90374b59091', '+201067878035', true, '2025-12-22 20:27:47', '2025-12-22 20:27:47', '892e70e5-b656-455e-a7f1-7945cb38bcc9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201143378224', "PhoneNumberConfirmed" = true WHERE "Id" = '5efa12a1-dbdc-4237-8689-d83ef872c7ce';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b0258f8f-b69d-41d9-838e-bf508a0faedb', '+201143378224', true, '2026-01-16 14:39:30', '2026-01-16 14:39:30', '5efa12a1-dbdc-4237-8689-d83ef872c7ce') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201283044483', "PhoneNumberConfirmed" = true WHERE "Id" = '29297a8d-cd5c-4338-9a30-7f75085c0612';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3b91f464-8b42-4c8f-9511-50cd4532b9a8', '+201283044483', true, '2026-01-12 13:40:08', '2026-01-12 13:40:08', '29297a8d-cd5c-4338-9a30-7f75085c0612') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201285000916', "PhoneNumberConfirmed" = true WHERE "Id" = 'd06d9a0d-ce36-417e-9567-eb0ad2d3baa8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ccdd5746-54f2-4032-8c42-22e8fdc7978e', '+201285000916', true, '2026-02-07 20:54:27', '2026-02-07 20:54:27', 'd06d9a0d-ce36-417e-9567-eb0ad2d3baa8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+12025550143', "PhoneNumberConfirmed" = true WHERE "Id" = '3451d565-3f45-42c6-a50e-f942643b2c16';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3b65b16f-bfcf-432b-b65a-8a40caa72cc7', '+12025550143', true, '2026-05-18 01:36:50', '2026-05-18 01:36:50', '3451d565-3f45-42c6-a50e-f942643b2c16') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201200750554', "PhoneNumberConfirmed" = true WHERE "Id" = '07d0bc72-38e2-41fc-94c2-9b0659484a96';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('be6df111-177c-42ea-bc6e-be9d8fe2d33c', '+201200750554', true, '2026-01-18 06:33:19', '2026-01-18 06:33:19', '07d0bc72-38e2-41fc-94c2-9b0659484a96') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201020533951', "PhoneNumberConfirmed" = true WHERE "Id" = '3528917c-4620-41f1-88c4-02501bef46ed';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('72c73d35-b5d8-4605-b629-75966157ba86', '+201020533951', true, '2026-02-05 21:47:28', '2026-02-05 21:47:28', '3528917c-4620-41f1-88c4-02501bef46ed') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201008589086', "PhoneNumberConfirmed" = true WHERE "Id" = '1e24f19e-98d7-49f6-84da-70696a2cb8bb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('309437aa-962a-47cd-90b4-ae449df141b1', '+201008589086', true, '2026-02-01 23:55:30', '2026-02-01 23:55:30', '1e24f19e-98d7-49f6-84da-70696a2cb8bb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022354597', "PhoneNumberConfirmed" = true WHERE "Id" = 'd1906861-09b0-4077-8e75-7242c962b315';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6a30d8f8-8a7a-4770-8495-e68371ec3f20', '+201022354597', true, '2026-02-09 22:37:24', '2026-02-09 22:37:24', 'd1906861-09b0-4077-8e75-7242c962b315') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201056238917', "PhoneNumberConfirmed" = true WHERE "Id" = '75488278-b631-4143-ad3f-011003f1b41a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4795dc41-5235-4275-9854-a8c3494fc830', '+201056238917', true, '2026-02-09 23:35:53', '2026-02-09 23:35:53', '75488278-b631-4143-ad3f-011003f1b41a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201141219360', "PhoneNumberConfirmed" = true WHERE "Id" = '5df353a6-904c-49bf-a93d-666d9a89858e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('df1f1631-481b-4e1f-a744-262e43e47124', '+201141219360', true, '2026-02-06 12:23:39', '2026-02-06 12:23:39', '5df353a6-904c-49bf-a93d-666d9a89858e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01141549607', "PhoneNumberConfirmed" = true WHERE "Id" = 'edf9c290-7b4a-41a7-8e9a-fb652750f77e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c9e6e2e7-756d-4891-8dea-9719d2b008db', '01141549607', true, '2025-12-31 01:02:23', '2025-12-31 01:02:23', 'edf9c290-7b4a-41a7-8e9a-fb652750f77e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201206314082', "PhoneNumberConfirmed" = true WHERE "Id" = 'dcb3d180-c66e-43f4-8482-b8833e85c9b8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8b74118d-3c12-4f14-b364-c1d29e03e34c', '+201206314082', true, '2026-02-08 18:23:23', '2026-02-08 18:23:23', 'dcb3d180-c66e-43f4-8482-b8833e85c9b8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064654309', "PhoneNumberConfirmed" = true WHERE "Id" = '2f11c6e7-f843-4201-9ffb-efa453a34990';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ebf89f52-fb9a-48b9-92a9-7ec7274fcd51', '+201064654309', true, '2026-02-08 20:46:27', '2026-02-08 20:46:27', '2f11c6e7-f843-4201-9ffb-efa453a34990') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201095282910', "PhoneNumberConfirmed" = true WHERE "Id" = '67801310-7bd4-4504-ad8e-113ee807b1ae';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b1dc6e39-e39d-4ba4-9c7e-82aa0a0d11e0', '+201095282910', true, '2026-02-09 08:45:25', '2026-02-09 08:45:25', '67801310-7bd4-4504-ad8e-113ee807b1ae') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201127671701', "PhoneNumberConfirmed" = true WHERE "Id" = '9a24925a-2ff7-49e2-8f0a-f22532b5a914';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a6af2db2-d954-4ab7-a778-831db4ad716d', '+201127671701', true, '2026-02-11 19:00:23', '2026-02-11 19:00:23', '9a24925a-2ff7-49e2-8f0a-f22532b5a914') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201012321202', "PhoneNumberConfirmed" = true WHERE "Id" = '845c5968-e8f6-4744-914a-24708f3ca303';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9a9434d5-6169-4d39-81b9-6d1360ac1a9b', '+201012321202', true, '2026-04-28 01:33:43', '2026-04-28 01:33:43', '845c5968-e8f6-4744-914a-24708f3ca303') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201024582672', "PhoneNumberConfirmed" = true WHERE "Id" = '5773172f-c0dc-4e43-86b5-aeef3f6d0ec3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fccee157-fea9-4099-81bb-09c746247e64', '+201024582672', true, '2025-12-22 20:47:55', '2025-12-22 20:47:55', '5773172f-c0dc-4e43-86b5-aeef3f6d0ec3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201116781892', "PhoneNumberConfirmed" = true WHERE "Id" = '3725cd9b-a87a-4976-8078-e490685131c9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('977cf63b-3bb8-4353-b23e-14754224a088', '+201116781892', true, '2026-01-09 12:04:15', '2026-01-09 12:04:15', '3725cd9b-a87a-4976-8078-e490685131c9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098899673', "PhoneNumberConfirmed" = true WHERE "Id" = '821478b1-c2eb-4a82-a876-4eac9b811c42';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('822a46d4-87b4-4eee-8592-12abbb446aa5', '+201098899673', true, '2025-09-23 00:14:02', '2025-09-23 00:14:02', '821478b1-c2eb-4a82-a876-4eac9b811c42') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201036008246', "PhoneNumberConfirmed" = true WHERE "Id" = '51b5bdb0-0abc-41cf-bf86-383fe508690f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cf53d604-fe64-4497-96c4-8121bb8a723f', '+201036008246', true, '2025-12-31 04:43:13', '2025-12-31 04:43:13', '51b5bdb0-0abc-41cf-bf86-383fe508690f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098229303', "PhoneNumberConfirmed" = true WHERE "Id" = 'e8a60359-5ef4-4784-8847-eeaa527ee776';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b2698b5e-492a-4ccc-a965-ee8ea96c46f9', '+201098229303', true, '2026-01-10 21:04:04', '2026-01-10 21:04:04', 'e8a60359-5ef4-4784-8847-eeaa527ee776') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213554785695', "PhoneNumberConfirmed" = true WHERE "Id" = '7f192092-c80a-4556-aa0c-9a47557094ed';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ab93b79f-90cc-4448-8fd5-4737c97830f8', '+213554785695', true, '2026-01-12 14:15:11', '2026-01-12 14:15:11', '7f192092-c80a-4556-aa0c-9a47557094ed') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061380510', "PhoneNumberConfirmed" = true WHERE "Id" = '65a65eb5-7d5d-499c-907b-4e6e9c93074b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('23b36bf7-3e20-476d-a18d-2ce70c2b4a22', '+201061380510', true, '2026-01-13 21:39:00', '2026-01-13 21:39:00', '65a65eb5-7d5d-499c-907b-4e6e9c93074b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021060376', "PhoneNumberConfirmed" = true WHERE "Id" = '76c50601-b108-412e-8521-dd0ac2cf92ba';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c9ee4f4b-647e-4a8f-a51e-b02e584b3519', '+201021060376', true, '2026-01-19 11:37:35', '2026-01-19 11:37:35', '76c50601-b108-412e-8521-dd0ac2cf92ba') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067395154', "PhoneNumberConfirmed" = true WHERE "Id" = 'f8a00e66-cc22-43be-80aa-a4037fb31d70';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6c8168e3-770a-4481-bb6c-9de8357f4bc3', '+201067395154', true, '2026-01-16 14:56:40', '2026-01-16 14:56:40', 'f8a00e66-cc22-43be-80aa-a4037fb31d70') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201155178059', "PhoneNumberConfirmed" = true WHERE "Id" = '11fbcd4d-88d3-418a-9809-d84a91797294';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4d3cdf14-6e08-4913-9233-28f5856c1c86', '+201155178059', true, '2026-02-07 09:07:51', '2026-02-07 09:07:51', '11fbcd4d-88d3-418a-9809-d84a91797294') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201027027715', "PhoneNumberConfirmed" = true WHERE "Id" = '3f47e438-e84b-4331-904f-d8d2bf0b7a57';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5bb241fc-4695-4a23-ae75-09da4171e8f0', '+201027027715', true, '2026-02-11 23:51:06', '2026-02-11 23:51:06', '3f47e438-e84b-4331-904f-d8d2bf0b7a57') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019087346', "PhoneNumberConfirmed" = true WHERE "Id" = 'e65fa71c-5797-4b70-b3f1-375e7255b4a8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5401db33-3610-4e85-977c-139b9e725c6b', '+201019087346', true, '2026-02-05 10:17:42', '2026-02-05 10:17:42', 'e65fa71c-5797-4b70-b3f1-375e7255b4a8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201126121539', "PhoneNumberConfirmed" = true WHERE "Id" = '3bb7e9f2-55d7-4519-98ff-1458898157be';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('029f0bef-c389-4d71-a499-f4070a85e68f', '+201126121539', true, '2026-02-03 17:48:08', '2026-02-03 17:48:08', '3bb7e9f2-55d7-4519-98ff-1458898157be') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01003855594', "PhoneNumberConfirmed" = true WHERE "Id" = 'e46a1ba0-b2bf-4659-a149-2b1bd5ff8c2d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0e45b819-c973-490f-87a1-0f49ca011baa', '01003855594', true, '2026-01-01 17:10:24', '2026-01-01 17:10:24', 'e46a1ba0-b2bf-4659-a149-2b1bd5ff8c2d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201116263895', "PhoneNumberConfirmed" = true WHERE "Id" = 'e550e1c7-0a17-4efe-9875-f5abc16d66d9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('70f9f7a5-f33c-4974-bf38-0033a0fe6b09', '+201116263895', true, '2026-02-06 14:14:27', '2026-02-06 14:14:27', 'e550e1c7-0a17-4efe-9875-f5abc16d66d9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201093517016', "PhoneNumberConfirmed" = true WHERE "Id" = '5e660bdc-ca52-4899-a1e6-9ed89bd8558a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b1b36343-627b-42a2-b518-cc3bf9200b23', '+201093517016', true, '2026-02-06 09:47:33', '2026-02-06 09:47:33', '5e660bdc-ca52-4899-a1e6-9ed89bd8558a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201556117189', "PhoneNumberConfirmed" = true WHERE "Id" = '923073f6-b21d-4e9d-8554-f7b2b69a5e7a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('71640a6c-ac69-42fa-b44b-30c7af570df1', '+201556117189', true, '2026-02-12 20:55:15', '2026-02-12 20:55:15', '923073f6-b21d-4e9d-8554-f7b2b69a5e7a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201005119995', "PhoneNumberConfirmed" = true WHERE "Id" = '0a4d30fa-8bdb-48e6-9a19-222706db0c84';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f18b78b7-2967-45aa-b9e3-dc0ef60d4314', '+201005119995', true, '2026-02-08 19:50:27', '2026-02-08 19:50:27', '0a4d30fa-8bdb-48e6-9a19-222706db0c84') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091898787', "PhoneNumberConfirmed" = true WHERE "Id" = 'a0432025-26de-4251-9aee-01f1b4e720fe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('00fb718b-b9b4-438c-ba5d-39fe48dab464', '+201091898787', true, '2025-11-11 21:15:48', '2025-11-11 21:15:48', 'a0432025-26de-4251-9aee-01f1b4e720fe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010296409', "PhoneNumberConfirmed" = true WHERE "Id" = '4abf755a-11a8-4d20-afba-b21fe55ea81b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d374ab42-bd00-4457-82a8-e63032c886a3', '+201010296409', true, '2025-12-20 03:14:26', '2025-12-20 03:14:26', '4abf755a-11a8-4d20-afba-b21fe55ea81b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201008725636', "PhoneNumberConfirmed" = true WHERE "Id" = 'e476c7c4-0b65-4985-b1d1-c8a4198dc394';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('28cf6d08-260c-4233-9d8a-0fdffec1260e', '+201008725636', true, '2025-12-25 21:37:05', '2025-12-25 21:37:05', 'e476c7c4-0b65-4985-b1d1-c8a4198dc394') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022339056', "PhoneNumberConfirmed" = true WHERE "Id" = 'dcb60a12-a5b8-41ff-8c98-9d3abb93261d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('84193377-c5e6-483a-8bd0-e38f84bdf57e', '+201022339056', true, '2026-02-04 19:12:18', '2026-02-04 19:12:18', 'dcb60a12-a5b8-41ff-8c98-9d3abb93261d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030212459', "PhoneNumberConfirmed" = true WHERE "Id" = '526c37fa-be0f-4722-ba28-a4eecc29227c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('67709be7-f1ba-4e1d-b23c-3f9f89f3e35a', '+201030212459', true, '2025-12-31 10:33:35', '2025-12-31 10:33:35', '526c37fa-be0f-4722-ba28-a4eecc29227c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060717621', "PhoneNumberConfirmed" = true WHERE "Id" = '3ba7c743-4d5c-4ab0-8b5d-38e3fd271054';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ddbec414-4c0e-4382-bf98-b09ca5c26fc2', '+201060717621', true, '2026-01-01 17:31:01', '2026-01-01 17:31:01', '3ba7c743-4d5c-4ab0-8b5d-38e3fd271054') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+441210060123', "PhoneNumberConfirmed" = true WHERE "Id" = 'bd3f5a20-141c-4666-891e-699a96340546';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('de296898-7196-4af0-abb8-906e7de527de', '+441210060123', true, '2026-01-19 12:16:46', '2026-01-19 12:16:46', 'bd3f5a20-141c-4666-891e-699a96340546') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01200221710', "PhoneNumberConfirmed" = true WHERE "Id" = '4485056f-edd5-4c41-9b69-c996eb47d8e6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('77f90c52-dd36-48fc-8414-8fd017511ca5', '01200221710', true, '2026-01-14 13:14:37', '2026-01-14 13:14:37', '4485056f-edd5-4c41-9b69-c996eb47d8e6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201011674678', "PhoneNumberConfirmed" = true WHERE "Id" = '8ab57a85-fe14-4c8f-9a66-b857aa25923d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7bfa8f53-335c-4013-9022-50441b1298e8', '+201011674678', true, '2026-01-09 12:10:21', '2026-01-09 12:10:21', '8ab57a85-fe14-4c8f-9a66-b857aa25923d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050931020', "PhoneNumberConfirmed" = true WHERE "Id" = 'c2656b69-41d0-4e50-b0e9-9a7778907ffe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('489ff2a1-10e2-4f17-abd0-3ae241cc5581', '+201050931020', true, '2026-01-10 21:23:42', '2026-01-10 21:23:42', 'c2656b69-41d0-4e50-b0e9-9a7778907ffe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966532463426', "PhoneNumberConfirmed" = true WHERE "Id" = '4348a286-93fd-45d0-8f2e-25ebc4b76364';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4d44c105-797a-4230-a838-87e64aaa206a', '+966532463426', true, '2026-05-17 18:49:02', '2026-05-17 18:49:02', '4348a286-93fd-45d0-8f2e-25ebc4b76364') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+919063845169', "PhoneNumberConfirmed" = true WHERE "Id" = 'd71575ba-ffe1-461b-9d9d-d3bc921f5a52';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('74ddb3ed-8c79-4f3f-8995-3e5103fccb02', '+919063845169', true, '2026-01-12 15:59:57', '2026-01-12 15:59:57', 'd71575ba-ffe1-461b-9d9d-d3bc921f5a52') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223928055', "PhoneNumberConfirmed" = true WHERE "Id" = 'b82b12b1-62b9-41a9-a271-01c3a5a2c55c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('01a6bbdd-3709-43d2-828a-b40cb804f13a', '+201223928055', true, '2026-02-07 09:21:26', '2026-02-07 09:21:26', 'b82b12b1-62b9-41a9-a271-01c3a5a2c55c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201123430161', "PhoneNumberConfirmed" = true WHERE "Id" = 'adf72a9e-d3ef-4f2c-a3b2-4f9672dfd312';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('60ba3a6f-d122-4d7c-b270-286af6968f14', '+201123430161', true, '2026-02-08 18:49:47', '2026-02-08 18:49:47', 'adf72a9e-d3ef-4f2c-a3b2-4f9672dfd312') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201226896550', "PhoneNumberConfirmed" = true WHERE "Id" = 'ed3c619c-4790-484f-87c8-44c01a9086f0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d1343f66-c20f-49c7-9ef4-5cb8842f81f9', '+201226896550', true, '2026-01-16 16:30:05', '2026-01-16 16:30:05', 'ed3c619c-4790-484f-87c8-44c01a9086f0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222771415', "PhoneNumberConfirmed" = true WHERE "Id" = '9d8339d8-aaec-4da0-8dcc-a886babab6a0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8c15d51e-184a-4673-b045-ba0d9944469f', '+201222771415', true, '2026-02-07 19:16:44', '2026-02-07 19:16:44', '9d8339d8-aaec-4da0-8dcc-a886babab6a0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01111656526', "PhoneNumberConfirmed" = true WHERE "Id" = '0b90b011-135b-41ab-bc58-33603359c88d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('37fa1822-f16f-43bc-9bed-bbd2526b56c8', '01111656526', true, '2026-02-03 21:37:55', '2026-02-03 21:37:55', '0b90b011-135b-41ab-bc58-33603359c88d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222996629', "PhoneNumberConfirmed" = true WHERE "Id" = '2a88d584-d640-48c0-9d77-d549bce42378';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8c958d41-63a4-483e-bc5b-211ceecf89c9', '+201222996629', true, '2026-02-08 01:47:32', '2026-02-08 01:47:32', '2a88d584-d640-48c0-9d77-d549bce42378') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201113075098', "PhoneNumberConfirmed" = true WHERE "Id" = '1ef0be8b-e0a6-40cc-a751-91974ec7e607';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b4259c2a-97cb-4316-b102-fa308dfe5f2d', '+201113075098', true, '2026-02-06 12:35:18', '2026-02-06 12:35:18', '1ef0be8b-e0a6-40cc-a751-91974ec7e607') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201225654873', "PhoneNumberConfirmed" = true WHERE "Id" = '677dd0fb-1afe-4dd6-ac77-bc2673276397';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0b597dd6-f055-4bbf-8e3c-01a5665c99eb', '+201225654873', true, '2026-02-06 14:20:11', '2026-02-06 14:20:11', '677dd0fb-1afe-4dd6-ac77-bc2673276397') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201012345341', "PhoneNumberConfirmed" = true WHERE "Id" = '9506d0ca-1864-49fb-901d-32aecb3d2706';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('97596206-3aaf-46ab-b3fd-8c5f85f81d87', '+201012345341', true, '2026-02-08 23:13:26', '2026-02-08 23:13:26', '9506d0ca-1864-49fb-901d-32aecb3d2706') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201158530665', "PhoneNumberConfirmed" = true WHERE "Id" = '7891dca7-4128-4923-af8b-5787776bbea0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b27d7f17-6498-41a8-b20c-f1d63e336fb6', '+201158530665', true, '2026-02-09 04:38:49', '2026-02-09 04:38:49', '7891dca7-4128-4923-af8b-5787776bbea0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004799094', "PhoneNumberConfirmed" = true WHERE "Id" = '08b3c394-c801-42e2-988d-587f8b6e0188';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7215f4c6-7d70-401d-8282-bd6c6635630e', '+201004799094', true, '2026-02-09 10:18:47', '2026-02-09 10:18:47', '08b3c394-c801-42e2-988d-587f8b6e0188') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201144855371', "PhoneNumberConfirmed" = true WHERE "Id" = '4348283e-1bd0-465d-a8a8-47d491291327';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ef667689-32bd-40c7-a385-45130c2b77a3', '+201144855371', true, '2026-02-12 21:09:54', '2026-02-12 21:09:54', '4348283e-1bd0-465d-a8a8-47d491291327') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201557208667', "PhoneNumberConfirmed" = true WHERE "Id" = '87a58f61-3c21-4166-835a-564bc214e33d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a68d0abd-bea8-46b1-9300-3f9cbf8349e7', '+201557208667', true, '2026-02-10 05:55:35', '2026-02-10 05:55:35', '87a58f61-3c21-4166-835a-564bc214e33d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201287721799', "PhoneNumberConfirmed" = true WHERE "Id" = 'c91b9c2b-98c0-422d-80d6-3fbee7271469';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('13836488-7424-43df-8e6a-5090fd79f596', '+201287721799', true, '2026-02-13 00:39:51', '2026-02-13 00:39:51', 'c91b9c2b-98c0-422d-80d6-3fbee7271469') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201280065019', "PhoneNumberConfirmed" = true WHERE "Id" = '105a870b-f33d-4f80-88f1-133386025ddf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fc97b61b-9155-423e-889c-0cb0de044eec', '+201280065019', true, '2026-02-09 15:04:36', '2026-02-09 15:04:36', '105a870b-f33d-4f80-88f1-133386025ddf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201118417617', "PhoneNumberConfirmed" = true WHERE "Id" = '7e47e37f-54a8-4a64-9edc-2a35a2e727eb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('15e2949d-ea96-4071-aa4e-9abb396add83', '+201118417617', true, '2026-02-08 20:31:26', '2026-02-08 20:31:26', '7e47e37f-54a8-4a64-9edc-2a35a2e727eb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004601270', "PhoneNumberConfirmed" = true WHERE "Id" = '1fc81a2d-d210-4c2c-8de6-e725cc546f82';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1fc4a718-5093-4b23-b14f-907079f5908e', '+201004601270', true, '2026-02-09 23:28:13', '2026-02-09 23:28:13', '1fc81a2d-d210-4c2c-8de6-e725cc546f82') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000125302', "PhoneNumberConfirmed" = true WHERE "Id" = '08b840a9-c3f1-4996-a9c1-7c6d3180d3e9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9a422812-8618-4924-8ee9-57103ab27ed4', '+201000125302', true, '2026-02-09 16:08:56', '2026-02-09 16:08:56', '08b840a9-c3f1-4996-a9c1-7c6d3180d3e9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201555834030', "PhoneNumberConfirmed" = true WHERE "Id" = 'f7c5b76f-8f79-40a7-b05e-e86153dd0519';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a0d76fcb-ea7a-44ed-a0ba-acd4c2f387c1', '+201555834030', true, '2026-02-09 23:38:18', '2026-02-09 23:38:18', 'f7c5b76f-8f79-40a7-b05e-e86153dd0519') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064043337', "PhoneNumberConfirmed" = true WHERE "Id" = '62cd301c-6045-4db5-944d-3a70348f8cf3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5b87d05a-6459-421f-8f4c-735a47a41230', '+201064043337', true, '2026-02-09 23:50:57', '2026-02-09 23:50:57', '62cd301c-6045-4db5-944d-3a70348f8cf3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201211232734', "PhoneNumberConfirmed" = true WHERE "Id" = '2455aa20-d848-47d0-bc0b-cf737ffe34d6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2fa376d7-c4ae-446a-9776-91dc897f6815', '+201211232734', true, '2026-02-13 11:58:11', '2026-02-13 11:58:11', '2455aa20-d848-47d0-bc0b-cf737ffe34d6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201212146267', "PhoneNumberConfirmed" = true WHERE "Id" = '2de935bf-b917-44b5-8b99-7acaed1904c4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e03a44fe-3707-4c3d-939b-489ee9cf47fa', '+201212146267', true, '2026-02-09 14:01:02', '2026-02-09 14:01:02', '2de935bf-b917-44b5-8b99-7acaed1904c4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050775811', "PhoneNumberConfirmed" = true WHERE "Id" = 'ae70e684-3da3-4ea8-9999-52553c7e4dd5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9b94199b-e38f-48ef-896a-8cf368147a83', '+201050775811', true, '2026-02-10 00:09:49', '2026-02-10 00:09:49', 'ae70e684-3da3-4ea8-9999-52553c7e4dd5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003084287', "PhoneNumberConfirmed" = true WHERE "Id" = '7a05dcc1-9a7c-482c-9a8d-68e58c855c8d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('81403c98-4686-4575-b4b4-3664d95b4612', '+201003084287', true, '2026-01-16 21:50:53', '2026-01-16 21:50:53', '7a05dcc1-9a7c-482c-9a8d-68e58c855c8d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201211521785', "PhoneNumberConfirmed" = true WHERE "Id" = '2eb00fc6-dd3d-434c-a187-58c18a5bd472';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c6788317-2cc0-47a8-a7b8-37863ba31796', '+201211521785', true, '2026-02-06 11:30:24', '2026-02-06 11:30:24', '2eb00fc6-dd3d-434c-a187-58c18a5bd472') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201096181896', "PhoneNumberConfirmed" = true WHERE "Id" = '01f4e20e-b72d-43cc-9763-882e8c85b3fa';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('786ffa1d-08fc-4aaf-8498-3ade776c0ca9', '+201096181896', true, '2026-02-13 16:18:20', '2026-02-13 16:18:20', '01f4e20e-b72d-43cc-9763-882e8c85b3fa') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019887098', "PhoneNumberConfirmed" = true WHERE "Id" = '48fdcf63-da47-4045-8062-be0ee60c722d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('78025025-7342-4723-a92f-e29e1742bc58', '+201019887098', true, '2026-02-10 02:00:43', '2026-02-10 02:00:43', '48fdcf63-da47-4045-8062-be0ee60c722d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019487343', "PhoneNumberConfirmed" = true WHERE "Id" = '9decedae-f486-4d8a-af02-663c44e59b7c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ad39f051-2842-46e5-a996-fd5545642b26', '+201019487343', true, '2026-02-09 09:33:34', '2026-02-09 09:33:34', '9decedae-f486-4d8a-af02-663c44e59b7c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201032642305', "PhoneNumberConfirmed" = true WHERE "Id" = 'd12fdb05-dc76-4c3b-afd4-2a7f8299e30a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2726e5dd-a894-4b67-8dd6-18c97cca624c', '+201032642305', true, '2026-02-13 16:58:00', '2026-02-13 16:58:00', 'd12fdb05-dc76-4c3b-afd4-2a7f8299e30a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030344937', "PhoneNumberConfirmed" = true WHERE "Id" = '281e4ad5-d627-4e06-85d2-bad4e197e8eb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('76a97cee-2f00-4598-beb5-2a557bf0ba72', '+201030344937', true, '2026-02-13 21:25:43', '2026-02-13 21:25:43', '281e4ad5-d627-4e06-85d2-bad4e197e8eb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099409301', "PhoneNumberConfirmed" = true WHERE "Id" = 'f0337011-d2e0-40c1-b995-28b95b9ffca6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('24a235d9-59b7-4016-8e57-9903f5326812', '+201099409301', true, '2026-05-11 18:49:01', '2026-05-11 18:49:01', 'f0337011-d2e0-40c1-b995-28b95b9ffca6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201206930444', "PhoneNumberConfirmed" = true WHERE "Id" = '45009fad-2848-4e6e-9da3-8fda8291f801';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a0a43ba3-b9be-4f45-a8b5-5651417f8224', '+201206930444', true, '2026-02-12 21:29:55', '2026-02-12 21:29:55', '45009fad-2848-4e6e-9da3-8fda8291f801') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201220144563', "PhoneNumberConfirmed" = true WHERE "Id" = '3c08985c-2fd4-4d04-8fca-5d0f2b05c8f1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fef0235c-07ea-460e-950e-4eade3461fc4', '+201220144563', true, '2026-02-14 20:15:29', '2026-02-14 20:15:29', '3c08985c-2fd4-4d04-8fca-5d0f2b05c8f1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201005100286', "PhoneNumberConfirmed" = true WHERE "Id" = 'e73ee8ff-1704-4ccf-93fe-3130157ace04';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0e296657-4dec-4dbf-907d-e2fc4dec89f5', '+201005100286', true, '2026-02-08 18:02:07', '2026-02-08 18:02:07', 'e73ee8ff-1704-4ccf-93fe-3130157ace04') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201500079429', "PhoneNumberConfirmed" = true WHERE "Id" = '5048f47c-c58a-4be5-a744-a9ef4b62a945';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('40a6920a-6046-48ce-aae3-1711c35d9bcc', '+201500079429', true, '2026-02-09 23:42:45', '2026-02-09 23:42:45', '5048f47c-c58a-4be5-a744-a9ef4b62a945') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003084186', "PhoneNumberConfirmed" = true WHERE "Id" = '7957e424-c9c7-4c24-8e3e-195ddc5b370b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e78cc936-796a-49ac-9672-a78613e2dbc6', '+201003084186', true, '2026-01-16 20:49:54', '2026-01-16 20:49:54', '7957e424-c9c7-4c24-8e3e-195ddc5b370b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201559338700', "PhoneNumberConfirmed" = true WHERE "Id" = '79a4a1fd-4954-474c-83e1-6e6ceff98ab3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('adbd9921-a09b-4824-9bd4-76f895196bdc', '+201559338700', true, '2026-02-14 18:59:03', '2026-02-14 18:59:03', '79a4a1fd-4954-474c-83e1-6e6ceff98ab3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201128057675', "PhoneNumberConfirmed" = true WHERE "Id" = 'e865310f-cc7d-44d0-9a88-ed26f0536163';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('04e87499-a02a-4156-ad96-ba54933bbc81', '+201128057675', true, '2026-02-10 10:32:07', '2026-02-10 10:32:07', 'e865310f-cc7d-44d0-9a88-ed26f0536163') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201557504951', "PhoneNumberConfirmed" = true WHERE "Id" = '427f1c07-bd94-4195-b2f5-831c58820cf5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f7a50e53-cb4c-4b19-aa2c-b3e6eeac0575', '+201557504951', true, '2026-02-09 18:33:35', '2026-02-09 18:33:35', '427f1c07-bd94-4195-b2f5-831c58820cf5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091163054', "PhoneNumberConfirmed" = true WHERE "Id" = '75dc6092-308c-4f70-9ee6-688991f3e21e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7a614495-1ecb-4206-a549-bcaba092090d', '+201091163054', true, '2026-02-14 19:32:39', '2026-02-14 19:32:39', '75dc6092-308c-4f70-9ee6-688991f3e21e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201017685258', "PhoneNumberConfirmed" = true WHERE "Id" = '9b358b25-ec11-45c9-94af-04eb9e34206b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('84ed2c36-e979-41fe-9b35-cf3efa7bdba1', '+201017685258', true, '2026-02-16 01:34:21', '2026-02-16 01:34:21', '9b358b25-ec11-45c9-94af-04eb9e34206b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010123788', "PhoneNumberConfirmed" = true WHERE "Id" = 'ff99c84a-c51f-44e0-945e-4feb87d8eb9c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7d34a345-045e-4801-8ac8-278eef43f49f', '+201010123788', true, '2026-02-10 19:16:24', '2026-02-10 19:16:24', 'ff99c84a-c51f-44e0-945e-4feb87d8eb9c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201033118313', "PhoneNumberConfirmed" = true WHERE "Id" = '7000f25f-e52a-4422-a019-cfce227fda37';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6b81ab3c-9d98-44e6-b1b8-b11068793f56', '+201033118313', true, '2026-02-10 17:32:23', '2026-02-10 17:32:23', '7000f25f-e52a-4422-a019-cfce227fda37') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002201588', "PhoneNumberConfirmed" = true WHERE "Id" = '34721cac-ceb3-4627-af9d-4436182aa143';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e1165575-a1cc-4006-b79b-bdca37cbd7de', '+201002201588', true, '2026-02-10 19:31:47', '2026-02-10 19:31:47', '34721cac-ceb3-4627-af9d-4436182aa143') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+972567259564', "PhoneNumberConfirmed" = true WHERE "Id" = '56a86e50-2210-43b7-ba7c-2190c75b26d4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0a6d7740-f70d-4dca-b103-20f559e4b4bc', '+972567259564', true, '2026-05-17 18:56:53', '2026-05-17 18:56:53', '56a86e50-2210-43b7-ba7c-2190c75b26d4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201118962212', "PhoneNumberConfirmed" = true WHERE "Id" = '39f2ecc0-b843-48af-b832-d19ab1ee5f06';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c69405d2-f42e-4c07-aa9e-5a5294a55dbd', '+201118962212', true, '2026-04-29 04:19:27', '2026-04-29 04:19:27', '39f2ecc0-b843-48af-b832-d19ab1ee5f06') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201097932555', "PhoneNumberConfirmed" = true WHERE "Id" = 'df730701-af96-4d1e-82b1-b335bce65ecd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('506b9fa1-8cd2-4ed8-b2bb-66f798287c22', '+201097932555', true, '2026-02-14 19:37:47', '2026-02-14 19:37:47', 'df730701-af96-4d1e-82b1-b335bce65ecd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01285268052', "PhoneNumberConfirmed" = true WHERE "Id" = '3d7a3e04-e2dc-4cf7-bbb8-795caf43ec61';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('28d35d0e-29a5-4505-8360-6c213df1b1d3', '01285268052', true, '2026-02-09 19:48:35', '2026-02-09 19:48:35', '3d7a3e04-e2dc-4cf7-bbb8-795caf43ec61') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025555365', "PhoneNumberConfirmed" = true WHERE "Id" = '4575993b-86a1-4e2e-947f-146d452d3530';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cd94188c-5554-4afc-b858-4906cea690ca', '+201025555365', true, '2026-02-13 08:50:17', '2026-02-13 08:50:17', '4575993b-86a1-4e2e-947f-146d452d3530') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201210433804', "PhoneNumberConfirmed" = true WHERE "Id" = 'e84bd1fa-4a1b-4aa0-a725-e34744c8d915';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f275e64f-6a17-4d30-ac1d-7b3a379efdd8', '+201210433804', true, '2026-02-13 00:23:01', '2026-02-13 00:23:01', 'e84bd1fa-4a1b-4aa0-a725-e34744c8d915') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223590996', "PhoneNumberConfirmed" = true WHERE "Id" = '512fe2f3-c85c-40f3-bc85-c54d5a67f355';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c92e869b-644c-4fc5-9be9-248b23d742d9', '+201223590996', true, '2026-02-13 17:12:52', '2026-02-13 17:12:52', '512fe2f3-c85c-40f3-bc85-c54d5a67f355') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067876717', "PhoneNumberConfirmed" = true WHERE "Id" = 'e932ef12-bbac-436e-bdd9-1570930adec2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2ce8c4c0-441a-4134-86a5-90ba1a5e95bb', '+201067876717', true, '2026-02-10 00:07:11', '2026-02-10 00:07:11', 'e932ef12-bbac-436e-bdd9-1570930adec2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000579027', "PhoneNumberConfirmed" = true WHERE "Id" = '17f0c397-0405-466a-b9b0-59764cbad4d8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d71fe89d-2494-46d8-946e-d467d9b69a5a', '+201000579027', true, '2026-02-13 22:08:20', '2026-02-13 22:08:20', '17f0c397-0405-466a-b9b0-59764cbad4d8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201274725939', "PhoneNumberConfirmed" = true WHERE "Id" = '8c728248-910c-4fcb-8fa6-79171e123d72';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ca78641d-a482-46a0-bf6c-4f073026b93f', '+201274725939', true, '2026-02-10 02:52:32', '2026-02-10 02:52:32', '8c728248-910c-4fcb-8fa6-79171e123d72') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201120144060', "PhoneNumberConfirmed" = true WHERE "Id" = 'e8e3c0b8-d630-4c9f-82c1-4e60332bd3d0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2cd28988-e617-421c-822a-2ae9b41e0265', '+201120144060', true, '2026-02-14 13:22:55', '2026-02-14 13:22:55', 'e8e3c0b8-d630-4c9f-82c1-4e60332bd3d0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201008772553', "PhoneNumberConfirmed" = true WHERE "Id" = '72f8dbcc-128a-4fcb-a36e-a8bef20a9345';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2c4874a7-fc9e-45dc-a3fb-5ee417912855', '+201008772553', true, '2026-02-14 14:34:42', '2026-02-14 14:34:42', '72f8dbcc-128a-4fcb-a36e-a8bef20a9345') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004112439', "PhoneNumberConfirmed" = true WHERE "Id" = 'b88d79c6-932b-468f-916a-304f296baf27';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d83b589e-9784-452c-b337-6a6645695bfe', '+201004112439', true, '2026-02-14 19:12:20', '2026-02-14 19:12:20', 'b88d79c6-932b-468f-916a-304f296baf27') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201245548756', "PhoneNumberConfirmed" = true WHERE "Id" = 'c5fec068-6fcb-49c1-9c06-e9c93b7e3a12';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('230b8e9f-d58e-4258-8155-26339a649e83', '+201245548756', true, '2026-02-10 16:35:04', '2026-02-10 16:35:04', 'c5fec068-6fcb-49c1-9c06-e9c93b7e3a12') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201210500371', "PhoneNumberConfirmed" = true WHERE "Id" = '7d3f4b63-525b-4322-8d0e-f08e5a7cba02';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e930433d-bb27-4841-9ebe-c763462e2329', '+201210500371', true, '2026-02-15 17:44:18', '2026-02-15 17:44:18', '7d3f4b63-525b-4322-8d0e-f08e5a7cba02') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201556378222', "PhoneNumberConfirmed" = true WHERE "Id" = '3e97a4b0-6cbe-400e-82d3-44e7af4d1cf9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('31358ab4-708e-4517-adc4-776325c97e23', '+201556378222', true, '2026-02-16 07:12:57', '2026-02-16 07:12:57', '3e97a4b0-6cbe-400e-82d3-44e7af4d1cf9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201018500001', "PhoneNumberConfirmed" = true WHERE "Id" = 'd5ae9cf5-d4bb-462b-bdf6-1e47111b89c5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('34d8ff80-c811-4fa7-b1df-62d3167ac14a', '+201018500001', true, '2026-02-10 19:32:22', '2026-02-10 19:32:22', 'd5ae9cf5-d4bb-462b-bdf6-1e47111b89c5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201007344355', "PhoneNumberConfirmed" = true WHERE "Id" = '34c2bdd2-8ece-4d86-b29d-6f5eed6f8d9a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('233374c8-a184-43b9-a775-c36c93872405', '+201007344355', true, '2026-02-06 01:50:13', '2026-02-06 01:50:13', '34c2bdd2-8ece-4d86-b29d-6f5eed6f8d9a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061255238', "PhoneNumberConfirmed" = true WHERE "Id" = 'ee969a9d-bbb8-4f7b-98fc-ff00464710c1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e43c17ea-a9e4-43a4-a7a8-d09fc8d72e97', '+201061255238', true, '2026-02-10 21:28:51', '2026-02-10 21:28:51', 'ee969a9d-bbb8-4f7b-98fc-ff00464710c1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201035802308', "PhoneNumberConfirmed" = true WHERE "Id" = 'c500c5f1-7ab2-4480-8068-6b467aeb074a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ef4ce946-473c-4200-89ef-b88f4fd5f68e', '+201035802308', true, '2026-02-10 21:49:50', '2026-02-10 21:49:50', 'c500c5f1-7ab2-4480-8068-6b467aeb074a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966510837663', "PhoneNumberConfirmed" = true WHERE "Id" = '8ac1692d-1357-4bdc-81f4-b98ed470e7cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c33aff1e-4576-48ca-9af0-fadc75f3d796', '+966510837663', true, '2026-02-10 23:10:28', '2026-02-10 23:10:28', '8ac1692d-1357-4bdc-81f4-b98ed470e7cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201029767649', "PhoneNumberConfirmed" = true WHERE "Id" = '1883d1c2-87c0-4017-b916-5f5000e7acda';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9445f890-8557-4b3d-926e-8537a2f44069', '+201029767649', true, '2026-02-10 23:20:30', '2026-02-10 23:20:30', '1883d1c2-87c0-4017-b916-5f5000e7acda') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966544808234', "PhoneNumberConfirmed" = true WHERE "Id" = 'a2c15d20-f371-4d69-97bd-a2ee3d29fb1a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('59b35ab5-a1ba-4a06-a4b6-618547846899', '+966544808234', true, '2026-02-10 23:22:52', '2026-02-10 23:22:52', 'a2c15d20-f371-4d69-97bd-a2ee3d29fb1a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002364869', "PhoneNumberConfirmed" = true WHERE "Id" = '2f22b94e-8124-4652-8775-5828f6dafa6b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('41afbd48-489a-4eed-89bd-3a0bfbfbc485', '+201002364869', true, '2025-11-29 11:59:23', '2025-11-29 11:59:23', '2f22b94e-8124-4652-8775-5828f6dafa6b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201026088531', "PhoneNumberConfirmed" = true WHERE "Id" = '72ce731e-af2e-4c8e-bf95-5c16fb05f04d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('884da5a7-0aba-4f57-8249-b6c3933b20e0', '+201026088531', true, '2026-02-08 20:08:13', '2026-02-08 20:08:13', '72ce731e-af2e-4c8e-bf95-5c16fb05f04d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201009705807', "PhoneNumberConfirmed" = true WHERE "Id" = 'ddad6a86-ce9d-49d7-8f0b-248acf80e476';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('33caada6-db31-4ed7-8682-cef695c623d7', '+201009705807', true, '2026-02-12 23:48:01', '2026-02-12 23:48:01', 'ddad6a86-ce9d-49d7-8f0b-248acf80e476') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201113118997', "PhoneNumberConfirmed" = true WHERE "Id" = 'c734f87b-b5b6-40c9-b01b-a2c73a13ad5a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('eec91358-e250-45e8-a0bc-99e33fc78e8f', '+201113118997', true, '2026-02-13 08:49:25', '2026-02-13 08:49:25', 'c734f87b-b5b6-40c9-b01b-a2c73a13ad5a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099860573', "PhoneNumberConfirmed" = true WHERE "Id" = '6f01cdc5-0d07-4c66-8493-d924c565545f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3f9b4544-18cc-4f47-aa92-af9be8277461', '+201099860573', true, '2026-02-13 16:14:26', '2026-02-13 16:14:26', '6f01cdc5-0d07-4c66-8493-d924c565545f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061009941', "PhoneNumberConfirmed" = true WHERE "Id" = '18a28579-bd68-4941-9b89-b21427b4e903';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('66c918e1-237c-469b-904a-6e6237285944', '+201061009941', true, '2026-02-15 07:52:24', '2026-02-15 07:52:24', '18a28579-bd68-4941-9b89-b21427b4e903') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201500923235', "PhoneNumberConfirmed" = true WHERE "Id" = '8afcce21-e363-47fa-a74a-a87e8e7bc1b5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('535207b6-7355-4ac1-b4b4-b63926ba86c1', '+201500923235', true, '2026-02-13 17:25:39', '2026-02-13 17:25:39', '8afcce21-e363-47fa-a74a-a87e8e7bc1b5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201111678482', "PhoneNumberConfirmed" = true WHERE "Id" = '9627ca42-513f-41b2-a315-4c6b568acb97';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7cb68263-9f5c-438b-960b-2c1db83b1ed0', '+201111678482', true, '2026-02-14 16:43:31', '2026-02-14 16:43:31', '9627ca42-513f-41b2-a315-4c6b568acb97') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201141783735', "PhoneNumberConfirmed" = true WHERE "Id" = '48ee6864-5a54-4b5d-bf7e-4e66f151150b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ae97b9d2-58e3-405f-9ae0-040b9bf8b7f8', '+201141783735', true, '2026-02-14 19:44:43', '2026-02-14 19:44:43', '48ee6864-5a54-4b5d-bf7e-4e66f151150b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01003272940', "PhoneNumberConfirmed" = true WHERE "Id" = '4c4a06f2-920c-4145-a4e7-5938895c8b66';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d3d8c551-1f90-41e0-a337-8cd5e7d356d9', '01003272940', true, '2026-02-14 17:18:57', '2026-02-14 17:18:57', '4c4a06f2-920c-4145-a4e7-5938895c8b66') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201113214482', "PhoneNumberConfirmed" = true WHERE "Id" = 'e0e844f7-da49-455c-9bb5-262389fd31b4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2d5d108a-6f51-4072-911f-929dba2a9f89', '+201113214482', true, '2026-02-15 13:14:21', '2026-02-15 13:14:21', 'e0e844f7-da49-455c-9bb5-262389fd31b4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201117069708', "PhoneNumberConfirmed" = true WHERE "Id" = 'd9685699-6739-4a84-8e20-761cb7bb5171';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c6c1eb87-ce5e-4f78-9592-138d0b30c8f3', '+201117069708', true, '2026-02-14 19:26:52', '2026-02-14 19:26:52', 'd9685699-6739-4a84-8e20-761cb7bb5171') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201013463706', "PhoneNumberConfirmed" = true WHERE "Id" = '8740a874-2dfc-4730-b490-d748e8e7a1b4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('22811193-8f7b-4839-b8a9-eca91fb7472e', '+201013463706', true, '2026-02-14 20:55:29', '2026-02-14 20:55:29', '8740a874-2dfc-4730-b490-d748e8e7a1b4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060078541', "PhoneNumberConfirmed" = true WHERE "Id" = 'b8d26e51-9188-4b74-a283-86b261dc356d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9cb3c9da-9402-4117-8e54-5a14bc4be7e6', '+201060078541', true, '2026-02-14 21:14:51', '2026-02-14 21:14:51', 'b8d26e51-9188-4b74-a283-86b261dc356d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201014824007', "PhoneNumberConfirmed" = true WHERE "Id" = '8def52a6-acb8-47da-ba4a-df61a215c9db';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3da689bf-2b6a-47a6-8953-a837a8d4c168', '+201014824007', true, '2026-02-16 08:16:14', '2026-02-16 08:16:14', '8def52a6-acb8-47da-ba4a-df61a215c9db') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201227042345', "PhoneNumberConfirmed" = true WHERE "Id" = 'd71d47ad-8644-4cfc-a814-572a164a9649';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('978d1788-31bf-47ee-86b3-dd19f8f79cac', '+201227042345', true, '2026-02-14 23:06:49', '2026-02-14 23:06:49', 'd71d47ad-8644-4cfc-a814-572a164a9649') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004905296', "PhoneNumberConfirmed" = true WHERE "Id" = '6e0f7f53-f5a3-4868-abbb-b9bd3529fbd0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c35dd7e7-ccc8-4b87-a03f-94b9d4024715', '+201004905296', true, '2026-02-15 18:55:53', '2026-02-15 18:55:53', '6e0f7f53-f5a3-4868-abbb-b9bd3529fbd0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201069523850', "PhoneNumberConfirmed" = true WHERE "Id" = 'c90d19dc-d9da-482f-a2b0-b112ff2a07f0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('480517f9-4cb9-4b8c-bf3e-3bb6d4649e92', '+201069523850', true, '2026-02-15 21:45:30', '2026-02-15 21:45:30', 'c90d19dc-d9da-482f-a2b0-b112ff2a07f0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201009383658', "PhoneNumberConfirmed" = true WHERE "Id" = '040872f9-19d8-4d0c-a72f-59ad05b7a990';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4adf6231-ab2f-4315-bb7f-45c81d1d0965', '+201009383658', true, '2026-02-16 10:37:24', '2026-02-16 10:37:24', '040872f9-19d8-4d0c-a72f-59ad05b7a990') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201122352652', "PhoneNumberConfirmed" = true WHERE "Id" = '5fe0c700-63e6-48a2-9717-d0302f071dab';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('739c85f3-8abd-46aa-ae85-004475ae10d2', '+201122352652', true, '2026-02-16 12:47:18', '2026-02-16 12:47:18', '5fe0c700-63e6-48a2-9717-d0302f071dab') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098899676', "PhoneNumberConfirmed" = true WHERE "Id" = 'd48046fd-0a53-44e0-aefe-097f82828b3c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c5591055-491f-429d-b158-920193b2c145', '+201098899676', true, '2025-09-28 13:45:09', '2025-09-28 13:45:09', 'd48046fd-0a53-44e0-aefe-097f82828b3c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201244536534', "PhoneNumberConfirmed" = true WHERE "Id" = 'cd1fbdd7-a582-43be-b155-8c39c9950ade';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7b0edfe9-d32d-4622-8b22-8542f337dfbd', '+201244536534', true, '2026-02-13 18:51:46', '2026-02-13 18:51:46', 'cd1fbdd7-a582-43be-b155-8c39c9950ade') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201015135747', "PhoneNumberConfirmed" = true WHERE "Id" = '29340321-4670-42ec-ab0d-5ff5c2a2ca3e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5868d159-3d11-4394-aa90-fe40d2b7704e', '+201015135747', true, '2026-02-11 11:55:04', '2026-02-11 11:55:04', '29340321-4670-42ec-ab0d-5ff5c2a2ca3e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201016555574', "PhoneNumberConfirmed" = true WHERE "Id" = '8fad61a3-8da9-4e8d-98a2-b2525e8ca1b8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('268bef06-95ad-41f7-8662-670a58a46366', '+201016555574', true, '2026-02-10 00:06:05', '2026-02-10 00:06:05', '8fad61a3-8da9-4e8d-98a2-b2525e8ca1b8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201097737737', "PhoneNumberConfirmed" = true WHERE "Id" = '17f8af1d-a3fb-4b58-b643-5cef0f39a46e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5f70f68b-b5ab-41a0-b755-de460fb29dcd', '+201097737737', true, '2026-02-12 17:17:30', '2026-02-12 17:17:30', '17f8af1d-a3fb-4b58-b643-5cef0f39a46e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201270139732', "PhoneNumberConfirmed" = true WHERE "Id" = 'fe353f1b-d8e6-421c-96e8-431d5072022e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('66ff1ca0-9d18-476a-aae8-333e87650984', '+201270139732', true, '2026-02-14 12:39:43', '2026-02-14 12:39:43', 'fe353f1b-d8e6-421c-96e8-431d5072022e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229632584', "PhoneNumberConfirmed" = true WHERE "Id" = 'c8313b00-761b-4f4f-9b25-efbc7c24666b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('825feda4-3c39-47cc-8ee8-c406744dd1b6', '+201229632584', true, '2026-02-13 00:12:12', '2026-02-13 00:12:12', 'c8313b00-761b-4f4f-9b25-efbc7c24666b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+861029157397', "PhoneNumberConfirmed" = true WHERE "Id" = '150edcd2-2f9a-41f8-a5c8-329bace0f2b1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7daa4ddc-3280-4391-af1a-33edbb0b6c7d', '+861029157397', true, '2026-02-14 17:05:05', '2026-02-14 17:05:05', '150edcd2-2f9a-41f8-a5c8-329bace0f2b1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223526699', "PhoneNumberConfirmed" = true WHERE "Id" = '9d21d4ac-9f17-4612-8a2a-766f73ba4064';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('87ce6485-83aa-4381-b558-51cd409aa5fc', '+201223526699', true, '2026-02-13 09:50:43', '2026-02-13 09:50:43', '9d21d4ac-9f17-4612-8a2a-766f73ba4064') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201120144061', "PhoneNumberConfirmed" = true WHERE "Id" = '49b46622-1389-4aa3-93dc-aa076afb335b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4b33e252-6c46-429a-8178-68744ee72ba4', '+201120144061', true, '2026-02-14 19:32:51', '2026-02-14 19:32:51', '49b46622-1389-4aa3-93dc-aa076afb335b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201286989162', "PhoneNumberConfirmed" = true WHERE "Id" = '4036ab3d-7c0c-478f-ac97-d0ea8d51e57f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4fb1986a-bd6b-4a10-8e9a-47fcb0585773', '+201286989162', true, '2026-02-13 16:17:39', '2026-02-13 16:17:39', '4036ab3d-7c0c-478f-ac97-d0ea8d51e57f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201127791644', "PhoneNumberConfirmed" = true WHERE "Id" = '13dbf05d-af41-47ee-b04f-148da9c4527e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8d68149f-2bb4-4a32-8716-16d9996872c6', '+201127791644', true, '2026-01-11 10:16:10', '2026-01-11 10:16:10', '13dbf05d-af41-47ee-b04f-148da9c4527e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201006132477', "PhoneNumberConfirmed" = true WHERE "Id" = 'a90db829-3f12-4256-b1a1-a98ba540fb37';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fd38ead9-61b4-460e-9759-eca7c729974b', '+201006132477', true, '2026-02-14 22:12:52', '2026-02-14 22:12:52', 'a90db829-3f12-4256-b1a1-a98ba540fb37') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201065436836', "PhoneNumberConfirmed" = true WHERE "Id" = 'd0855751-862a-4ad2-9afc-93731de45d29';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9ddb1dbf-b500-4205-9d8e-5412e116ff10', '+201065436836', true, '2026-02-15 09:59:56', '2026-02-15 09:59:56', 'd0855751-862a-4ad2-9afc-93731de45d29') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201032538232', "PhoneNumberConfirmed" = true WHERE "Id" = '4dcf7f04-ca60-4f62-95d4-f2f93fbe0c3c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cc184cba-5381-4d9f-935d-3e1c0c8a8e77', '+201032538232', true, '2026-02-16 10:35:04', '2026-02-16 10:35:04', '4dcf7f04-ca60-4f62-95d4-f2f93fbe0c3c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201035658955', "PhoneNumberConfirmed" = true WHERE "Id" = 'e645489e-da0a-45c3-9dc9-b91bf1c53b04';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('274adc41-64c7-4a00-a28e-cb64b363081c', '+201035658955', true, '2026-02-16 12:54:55', '2026-02-16 12:54:55', 'e645489e-da0a-45c3-9dc9-b91bf1c53b04') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025346985', "PhoneNumberConfirmed" = true WHERE "Id" = 'a2b6b6aa-9735-4511-8de8-2f6a433935dd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('188e961d-e6c8-4f6c-a832-034101220d85', '+201025346985', true, '2026-02-16 11:21:10', '2026-02-16 11:21:10', 'a2b6b6aa-9735-4511-8de8-2f6a433935dd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201009009693', "PhoneNumberConfirmed" = true WHERE "Id" = 'a76ae7d6-2d4f-4062-b8be-c39091cb47df';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b27fa6e8-7f13-4c64-9296-b4013603b37d', '+201009009693', true, '2026-02-16 14:35:18', '2026-02-16 14:35:18', 'a76ae7d6-2d4f-4062-b8be-c39091cb47df') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201270737942', "PhoneNumberConfirmed" = true WHERE "Id" = '275991af-efd4-4997-ac69-1b17f64399c8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3fe07e92-6eb3-47cd-b21b-0154c91c9199', '+201270737942', true, '2026-02-16 15:14:34', '2026-02-16 15:14:34', '275991af-efd4-4997-ac69-1b17f64399c8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201026850344', "PhoneNumberConfirmed" = true WHERE "Id" = '93630603-f783-4fc0-b2b4-12f0a3790e68';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0d11c2f9-d635-4aaa-84e8-68f4c91a4b1b', '+201026850344', true, '2026-02-16 15:23:10', '2026-02-16 15:23:10', '93630603-f783-4fc0-b2b4-12f0a3790e68') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201555755621', "PhoneNumberConfirmed" = true WHERE "Id" = 'fef0a7c5-1405-45ac-87a0-1fd1c2bb03e1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('140f6d63-693f-4a60-9469-a9c7c04ca9f4', '+201555755621', true, '2026-02-16 15:39:21', '2026-02-16 15:39:21', 'fef0a7c5-1405-45ac-87a0-1fd1c2bb03e1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201228743983', "PhoneNumberConfirmed" = true WHERE "Id" = '00ad722e-b755-466d-97ee-3d3466aa5b5e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1eadc374-5043-423a-b241-0879f055f577', '+201228743983', true, '2026-02-16 19:03:34', '2026-02-16 19:03:34', '00ad722e-b755-466d-97ee-3d3466aa5b5e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201120280067', "PhoneNumberConfirmed" = true WHERE "Id" = '4a62a947-8b7d-4ffc-bfb3-dc5043dc7e08';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6ee24f1f-fcbd-46fb-a4e3-c450b9927550', '+201120280067', true, '2026-02-16 20:41:20', '2026-02-16 20:41:20', '4a62a947-8b7d-4ffc-bfb3-dc5043dc7e08') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201117628089', "PhoneNumberConfirmed" = true WHERE "Id" = 'c4f2a8db-86e8-4af0-b194-b1aeaee64f2e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b415b4a5-de9e-478f-955a-0a11ef6c95b5', '+201117628089', true, '2026-02-16 22:07:03', '2026-02-16 22:07:03', 'c4f2a8db-86e8-4af0-b194-b1aeaee64f2e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+9647852068651', "PhoneNumberConfirmed" = true WHERE "Id" = '0385bf65-6310-41bf-b16f-50588e6315c8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cca507bf-4c9d-4811-a3a2-ae34b02f5b8a', '+9647852068651', true, '2026-02-16 23:02:24', '2026-02-16 23:02:24', '0385bf65-6310-41bf-b16f-50588e6315c8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201122390340', "PhoneNumberConfirmed" = true WHERE "Id" = '80711989-95b8-4b5b-8fdf-ed31a7c4943a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f586cfaa-d1b5-4bfb-9036-daadb0573219', '+201122390340', true, '2026-02-16 18:08:50', '2026-02-16 18:08:50', '80711989-95b8-4b5b-8fdf-ed31a7c4943a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099868082', "PhoneNumberConfirmed" = true WHERE "Id" = '315a907b-6e19-45ee-b76f-6e1adfdc9564';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8079bed2-ef51-4e5b-8c73-417977f47c0f', '+201099868082', true, '2026-02-17 00:54:04', '2026-02-17 00:54:04', '315a907b-6e19-45ee-b76f-6e1adfdc9564') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021972116', "PhoneNumberConfirmed" = true WHERE "Id" = '21ed4586-9063-40b8-9c96-ae4e22fd0007';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8d592939-4bac-4aaf-a5e9-3288e664178b', '+201021972116', true, '2026-04-08 00:50:46', '2026-04-08 00:50:46', '21ed4586-9063-40b8-9c96-ae4e22fd0007') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201212135203', "PhoneNumberConfirmed" = true WHERE "Id" = '42bc806a-592e-4a09-b8f2-877354bfeba9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cd12b214-3ffd-4e5d-ad04-cf3aa570f843', '+201212135203', true, '2026-02-17 01:11:02', '2026-02-17 01:11:02', '42bc806a-592e-4a09-b8f2-877354bfeba9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201111161075', "PhoneNumberConfirmed" = true WHERE "Id" = 'f8bfa4ed-f69f-4740-9b13-125cc65161be';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e49b9e0f-39d0-4b34-97b0-c56c06f91947', '+201111161075', true, '2026-04-15 07:52:06', '2026-04-15 07:52:06', 'f8bfa4ed-f69f-4740-9b13-125cc65161be') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201283691056', "PhoneNumberConfirmed" = true WHERE "Id" = '9655883d-d6a3-4571-896c-6c9dbbc5d2eb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ad96d4ae-20d8-4b04-a14e-e5328eb32099', '+201283691056', true, '2026-04-13 07:08:47', '2026-04-13 07:08:47', '9655883d-d6a3-4571-896c-6c9dbbc5d2eb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201100989387', "PhoneNumberConfirmed" = true WHERE "Id" = '07675c8d-5ebe-445a-b303-0f801b3586a2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e59c49bb-901a-465b-85e2-e77f995536f5', '+201100989387', true, '2026-04-15 11:51:58', '2026-04-15 11:51:58', '07675c8d-5ebe-445a-b303-0f801b3586a2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201123591309', "PhoneNumberConfirmed" = true WHERE "Id" = '6c1e4fbb-9eaf-46f0-a052-40c245960a8b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('45b08047-117c-4599-be2d-de874619f789', '+201123591309', true, '2026-04-09 03:07:41', '2026-04-09 03:07:41', '6c1e4fbb-9eaf-46f0-a052-40c245960a8b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201119185645', "PhoneNumberConfirmed" = true WHERE "Id" = '828989dc-ab9c-41cf-9150-3edebc05435a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a381371e-8444-4322-b196-2ff300889c1b', '+201119185645', true, '2026-05-13 21:21:22', '2026-05-13 21:21:22', '828989dc-ab9c-41cf-9150-3edebc05435a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+447990850101', "PhoneNumberConfirmed" = true WHERE "Id" = '7cedd88f-22d3-4af2-b738-f9d38eb9ea3b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d29cde4c-6f73-4b87-aeeb-b5bae47cc552', '+447990850101', true, '2026-05-17 18:47:40', '2026-05-17 18:47:40', '7cedd88f-22d3-4af2-b738-f9d38eb9ea3b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201289047602', "PhoneNumberConfirmed" = true WHERE "Id" = 'd8a97b5d-e52e-4b24-a6eb-4c3172ddc5be';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5b0f13af-e96c-41cf-a63e-6789f2cf1e4c', '+201289047602', true, '2026-04-13 13:09:08', '2026-04-13 13:09:08', 'd8a97b5d-e52e-4b24-a6eb-4c3172ddc5be') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '‏‪010 00869750‬‏', "PhoneNumberConfirmed" = true WHERE "Id" = '503f9154-5a2e-40c1-8fe5-080141238ced';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3c506b9f-c904-4b6d-a67e-5c32d665a7cf', '‏‪010 00869750‬‏', true, '2026-04-07 07:49:04', '2026-04-07 07:49:04', '503f9154-5a2e-40c1-8fe5-080141238ced') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201551644187', "PhoneNumberConfirmed" = true WHERE "Id" = 'de68fb22-fa94-49c7-a09f-921099cd920b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0b37e60a-58df-49a9-8510-4b65e74548b4', '+201551644187', true, '2026-04-12 22:03:55', '2026-04-12 22:03:55', 'de68fb22-fa94-49c7-a09f-921099cd920b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201145108046', "PhoneNumberConfirmed" = true WHERE "Id" = '484bfedd-6ee3-46be-aa10-86b8996e47dc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('04e15a21-2e9b-4745-8145-f7d9a21f5e14', '+201145108046', true, '2026-04-12 14:07:06', '2026-04-12 14:07:06', '484bfedd-6ee3-46be-aa10-86b8996e47dc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201272985782', "PhoneNumberConfirmed" = true WHERE "Id" = '1e9be316-9ef2-43e9-a124-bce6bc08c9a8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8fc987e1-6108-4df3-a4c7-62da3ae7c898', '+201272985782', true, '2026-04-13 18:46:51', '2026-04-13 18:46:51', '1e9be316-9ef2-43e9-a124-bce6bc08c9a8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201044710657', "PhoneNumberConfirmed" = true WHERE "Id" = 'ff873dd7-7bd9-4787-8316-d1aa746d8856';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('afded64e-699e-4e13-b80b-6a039644a13a', '+201044710657', true, '2026-04-13 21:16:28', '2026-04-13 21:16:28', 'ff873dd7-7bd9-4787-8316-d1aa746d8856') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090829736', "PhoneNumberConfirmed" = true WHERE "Id" = 'e0e0f587-1d77-4433-a74a-0507157e22da';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5d9c24be-ebd5-4cb7-b636-bb9da225e7ed', '+201090829736', true, '2026-04-14 14:26:43', '2026-04-14 14:26:43', 'e0e0f587-1d77-4433-a74a-0507157e22da') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201017787724', "PhoneNumberConfirmed" = true WHERE "Id" = 'b46363c3-622d-4029-b31c-fc0fc601d1a1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4401cab3-88bb-47a7-b017-0026125afded', '+201017787724', true, '2026-02-17 15:01:29', '2026-02-17 15:01:29', 'b46363c3-622d-4029-b31c-fc0fc601d1a1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201009009692', "PhoneNumberConfirmed" = true WHERE "Id" = '6ccb4c92-3f50-4ff1-bac2-b577a712d722';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9accbd7c-8c52-4b9f-ab40-a96c63ee8f98', '+201009009692', true, '2026-02-17 07:44:31', '2026-02-17 07:44:31', '6ccb4c92-3f50-4ff1-bac2-b577a712d722') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201225416534', "PhoneNumberConfirmed" = true WHERE "Id" = '9a3353cd-2e06-497a-832b-d425aec1441e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f63ed604-0259-4602-9a5f-1a8b41278806', '+201225416534', true, '2026-02-17 07:33:31', '2026-02-17 07:33:31', '9a3353cd-2e06-497a-832b-d425aec1441e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030545317', "PhoneNumberConfirmed" = true WHERE "Id" = 'eafc2292-91e5-4ec8-8be4-f0bef35ded0a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3ad445a1-6dd2-46e9-bb50-f578c02753cb', '+201030545317', true, '2026-02-17 13:55:16', '2026-02-17 13:55:16', 'eafc2292-91e5-4ec8-8be4-f0bef35ded0a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201062354455', "PhoneNumberConfirmed" = true WHERE "Id" = '96764428-0f0a-4718-83a2-82c677c624ba';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3562590d-e55a-4383-9797-10b074d4de11', '+201062354455', true, '2026-02-17 10:56:07', '2026-02-17 10:56:07', '96764428-0f0a-4718-83a2-82c677c624ba') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201288884754', "PhoneNumberConfirmed" = true WHERE "Id" = '4b781193-4737-4c82-9c9a-119546fdeeaf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c2cd5a25-f56c-4775-b34a-8629489e3bde', '+201288884754', true, '2026-02-17 16:23:29', '2026-02-17 16:23:29', '4b781193-4737-4c82-9c9a-119546fdeeaf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201107837053', "PhoneNumberConfirmed" = true WHERE "Id" = 'e75b0b6e-1730-409a-9dba-ec9cbf09a848';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7a88fd63-a766-4152-a308-9c182721eb6e', '+201107837053', true, '2026-02-17 12:01:30', '2026-02-17 12:01:30', 'e75b0b6e-1730-409a-9dba-ec9cbf09a848') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066808810', "PhoneNumberConfirmed" = true WHERE "Id" = '688e8d7f-b660-48a5-abda-a93c8375912c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8a0d20e5-83e3-4912-9f51-99fe30c4d7df', '+201066808810', true, '2026-02-17 12:07:43', '2026-02-17 12:07:43', '688e8d7f-b660-48a5-abda-a93c8375912c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201203112340', "PhoneNumberConfirmed" = true WHERE "Id" = 'f942a496-c9ef-4069-bacf-fb44beec08a6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c6296093-7745-4538-93c0-df2bd449d254', '+201203112340', true, '2026-02-17 09:15:44', '2026-02-17 09:15:44', 'f942a496-c9ef-4069-bacf-fb44beec08a6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201105336089', "PhoneNumberConfirmed" = true WHERE "Id" = '281422c2-b72b-4eb7-bd57-c99668c2460a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('499597c9-49d0-44cc-8c3b-b85a922f41f2', '+201105336089', true, '2026-02-17 19:58:41', '2026-02-17 19:58:41', '281422c2-b72b-4eb7-bd57-c99668c2460a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201200328629', "PhoneNumberConfirmed" = true WHERE "Id" = '90fba3d5-58b5-4060-9b57-06f1281432a6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e0d15597-c9b3-4c30-8d70-fe3ccbebc0ea', '+201200328629', true, '2026-05-01 16:34:25', '2026-05-01 16:34:25', '90fba3d5-58b5-4060-9b57-06f1281432a6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201122665520', "PhoneNumberConfirmed" = true WHERE "Id" = '18149a7e-bd5a-4ccc-b364-51eef46521e2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('673795df-8814-47ba-a68c-88e238e26e04', '+201122665520', true, '2026-02-13 03:36:38', '2026-02-13 03:36:38', '18149a7e-bd5a-4ccc-b364-51eef46521e2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201060664667', "PhoneNumberConfirmed" = true WHERE "Id" = '51c9fa41-ced3-4fd0-affe-6ff3f04e51bb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('16d6cc68-119a-4a58-9873-d1060a7b0919', '+201060664667', true, '2026-02-12 21:50:00', '2026-02-12 21:50:00', '51c9fa41-ced3-4fd0-affe-6ff3f04e51bb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201205611059', "PhoneNumberConfirmed" = true WHERE "Id" = '37e0e7a1-653c-49be-86c6-a20e5ef3c348';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('16b7c0a0-0e01-4905-9ab7-7ecad5197474', '+201205611059', true, '2026-02-17 21:00:38', '2026-02-17 21:00:38', '37e0e7a1-653c-49be-86c6-a20e5ef3c348') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201224609678', "PhoneNumberConfirmed" = true WHERE "Id" = 'ca115c2d-b5bf-4ca3-bbd3-8092e6a11714';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1da40f43-7e9e-4b47-a4e3-0993d6668195', '+201224609678', true, '2026-01-01 06:33:57', '2026-01-01 06:33:57', 'ca115c2d-b5bf-4ca3-bbd3-8092e6a11714') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201009886958', "PhoneNumberConfirmed" = true WHERE "Id" = '3f70ae28-2e0a-4dde-a633-1a634ce7a263';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b96711ee-64f9-41d7-bc1a-1d718d3d4f19', '+201009886958', true, '2026-02-17 08:48:47', '2026-02-17 08:48:47', '3f70ae28-2e0a-4dde-a633-1a634ce7a263') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201114420207', "PhoneNumberConfirmed" = true WHERE "Id" = '00b7bcde-af1d-4902-aafb-7d46afd90681';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e42895cb-15b7-4e7d-8429-0c6f6f790529', '+201114420207', true, '2026-02-17 21:20:08', '2026-02-17 21:20:08', '00b7bcde-af1d-4902-aafb-7d46afd90681') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201068282430', "PhoneNumberConfirmed" = true WHERE "Id" = '1bfd65c7-129c-41ee-8335-777911c54a8c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9e24101f-a115-4ae8-9b93-9626623e1b4f', '+201068282430', true, '2026-02-17 21:41:27', '2026-02-17 21:41:27', '1bfd65c7-129c-41ee-8335-777911c54a8c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002743685', "PhoneNumberConfirmed" = true WHERE "Id" = '1a9d62d5-af87-4251-a14b-2554ddb9eceb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('14654978-27be-4ffb-9660-a40bcda1cab1', '+201002743685', true, '2026-02-17 21:42:58', '2026-02-17 21:42:58', '1a9d62d5-af87-4251-a14b-2554ddb9eceb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201006991554', "PhoneNumberConfirmed" = true WHERE "Id" = '0e83771d-e2a9-4bd8-bb97-3f0fd053d94e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9a66792b-3358-4a0d-b389-ca1dcc417250', '+201006991554', true, '2026-02-17 22:09:57', '2026-02-17 22:09:57', '0e83771d-e2a9-4bd8-bb97-3f0fd053d94e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01554329847', "PhoneNumberConfirmed" = true WHERE "Id" = '4927147e-9bc0-4493-9f44-69f7b8a9d43c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7ff7b8a3-dcd5-4a24-8edf-260f077ba4a0', '01554329847', true, '2026-02-20 17:04:18', '2026-02-20 17:04:18', '4927147e-9bc0-4493-9f44-69f7b8a9d43c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201289817094', "PhoneNumberConfirmed" = true WHERE "Id" = '3dcc9134-4f12-4193-b77c-7003d39ab443';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('028d1c4f-58de-4db8-b8e7-6c05b80a4aa8', '+201289817094', true, '2026-02-17 22:46:25', '2026-02-17 22:46:25', '3dcc9134-4f12-4193-b77c-7003d39ab443') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201118941839', "PhoneNumberConfirmed" = true WHERE "Id" = 'e97fe999-a398-4a50-9dbc-06a2b1f9d86a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('085d9c70-b19b-43ff-ac18-0beb30326fb1', '+201118941839', true, '2026-02-05 20:21:42', '2026-02-05 20:21:42', 'e97fe999-a398-4a50-9dbc-06a2b1f9d86a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002122356', "PhoneNumberConfirmed" = true WHERE "Id" = '81d2ce00-b515-4976-b622-bd1d4f523415';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d865664f-92d8-4f4f-803b-777e5be7a566', '+201002122356', true, '2026-02-18 02:34:10', '2026-02-18 02:34:10', '81d2ce00-b515-4976-b622-bd1d4f523415') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201023450835', "PhoneNumberConfirmed" = true WHERE "Id" = '8cc59a4f-4b10-47a4-9a00-fa4780f92d84';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4965ce55-1da1-4d79-9e72-769e3878f89a', '+201023450835', true, '2026-02-18 12:16:24', '2026-02-18 12:16:24', '8cc59a4f-4b10-47a4-9a00-fa4780f92d84') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201020347946', "PhoneNumberConfirmed" = true WHERE "Id" = '7affa036-d8b4-4a2e-b424-7caf0c5580ad';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ba04b5f0-1f14-4810-b4ae-cc0ceacbebf0', '+201020347946', true, '2026-02-18 06:30:58', '2026-02-18 06:30:58', '7affa036-d8b4-4a2e-b424-7caf0c5580ad') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201207688823', "PhoneNumberConfirmed" = true WHERE "Id" = '278e9a34-f89b-447d-872e-15ad0a53a977';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7c060b93-23a6-4a42-808c-10c967c523a7', '+201207688823', true, '2026-02-17 23:47:37', '2026-02-17 23:47:37', '278e9a34-f89b-447d-872e-15ad0a53a977') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002746667', "PhoneNumberConfirmed" = true WHERE "Id" = 'a35f49b2-7d64-4fbb-b011-28706002bba0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4ec3cd9e-9b1e-4029-b397-ef64f34c3d61', '+201002746667', true, '2026-02-18 08:48:38', '2026-02-18 08:48:38', 'a35f49b2-7d64-4fbb-b011-28706002bba0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201227714153', "PhoneNumberConfirmed" = true WHERE "Id" = '8280ccd4-2608-47f1-ad34-54068536ea73';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('23f1ab89-d183-49f6-9cf6-514f0844c564', '+201227714153', true, '2026-02-18 00:01:55', '2026-02-18 00:01:55', '8280ccd4-2608-47f1-ad34-54068536ea73') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201229851912', "PhoneNumberConfirmed" = true WHERE "Id" = 'bc1fe734-e857-451c-ae54-de92ed616e79';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4ae3402a-16a4-4913-a7d7-b5cb711e1025', '+201229851912', true, '2026-02-18 09:20:33', '2026-02-18 09:20:33', 'bc1fe734-e857-451c-ae54-de92ed616e79') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01068050522', "PhoneNumberConfirmed" = true WHERE "Id" = 'c2b6c5fa-6005-43bc-8045-b802e1bf2161';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('051cd364-8df7-4d70-ba64-cf532b858a8b', '01068050522', true, '2026-02-18 22:20:43', '2026-02-18 22:20:43', 'c2b6c5fa-6005-43bc-8045-b802e1bf2161') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201228814156', "PhoneNumberConfirmed" = true WHERE "Id" = '1232d4dc-badd-4e1e-862a-1ababcc47b65';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('24f97063-72a0-40d0-bfeb-e72ec300b7f6', '+201228814156', true, '2026-02-18 00:13:13', '2026-02-18 00:13:13', '1232d4dc-badd-4e1e-862a-1ababcc47b65') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201277266283', "PhoneNumberConfirmed" = true WHERE "Id" = 'f7d7f8e9-5426-4c62-ac5b-06598b74e1ab';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('04fc5428-bd55-4132-846a-4ab16b770662', '+201277266283', true, '2026-02-18 02:33:14', '2026-02-18 02:33:14', 'f7d7f8e9-5426-4c62-ac5b-06598b74e1ab') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01063022811', "PhoneNumberConfirmed" = true WHERE "Id" = 'a1e4f2c2-74f5-4fa5-be74-b3a8cbabbfdc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('27b1c435-5327-4477-b6d7-5d5fd7051c06', '01063022811', true, '2026-02-17 23:02:33', '2026-02-17 23:02:33', 'a1e4f2c2-74f5-4fa5-be74-b3a8cbabbfdc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+12355468974', "PhoneNumberConfirmed" = true WHERE "Id" = '329fb4ae-ebd1-4f2a-b03a-4f016d1f48a9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('af87303a-9031-458d-8f6a-9e1a18755774', '+12355468974', true, '2026-02-18 12:02:46', '2026-02-18 12:02:46', '329fb4ae-ebd1-4f2a-b03a-4f016d1f48a9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201157022568', "PhoneNumberConfirmed" = true WHERE "Id" = 'd9253ea1-35d9-47f1-9229-7fe2d4281bdf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c5f83631-991d-4a9c-954e-ca16bd0dd35d', '+201157022568', true, '2026-02-18 15:39:13', '2026-02-18 15:39:13', 'd9253ea1-35d9-47f1-9229-7fe2d4281bdf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201013321230', "PhoneNumberConfirmed" = true WHERE "Id" = 'f104aff4-ccc2-4af4-a824-754ebee79428';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('10941444-8e14-4bd3-8100-31838f60c8dd', '+201013321230', true, '2026-02-18 12:29:35', '2026-02-18 12:29:35', 'f104aff4-ccc2-4af4-a824-754ebee79428') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003315765', "PhoneNumberConfirmed" = true WHERE "Id" = '2d65f33b-8407-44a0-8924-1ef3edd3f93b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0caa471b-7b2f-4124-8480-dd253eeb1eb1', '+201003315765', true, '2026-02-18 12:41:20', '2026-02-18 12:41:20', '2d65f33b-8407-44a0-8924-1ef3edd3f93b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201147309080', "PhoneNumberConfirmed" = true WHERE "Id" = 'b2798cea-d5bb-41b6-925e-82a3704357c3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b46ecc2d-b305-448c-a0c8-49c61ca99321', '+201147309080', true, '2026-02-18 14:19:13', '2026-02-18 14:19:13', 'b2798cea-d5bb-41b6-925e-82a3704357c3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01013536365', "PhoneNumberConfirmed" = true WHERE "Id" = '2559736a-0c5a-4d8d-aaa3-4094177d36a5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d5bc1426-4048-45b1-b58c-20c6f6eef66c', '01013536365', true, '2026-01-12 22:54:14', '2026-01-12 22:54:14', '2559736a-0c5a-4d8d-aaa3-4094177d36a5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201223389605', "PhoneNumberConfirmed" = true WHERE "Id" = '92755d29-6d8d-4fd1-8f8e-5175b925c52e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9dd3c364-79c7-4203-8825-c8c089c99d76', '+201223389605', true, '2026-02-18 20:29:47', '2026-02-18 20:29:47', '92755d29-6d8d-4fd1-8f8e-5175b925c52e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001516532', "PhoneNumberConfirmed" = true WHERE "Id" = '82e14003-4ca9-40cd-a672-4fb494b72466';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9945f773-ca98-4d02-a76e-32eec91f3686', '+201001516532', true, '2026-02-19 10:52:58', '2026-02-19 10:52:58', '82e14003-4ca9-40cd-a672-4fb494b72466') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201094442301', "PhoneNumberConfirmed" = true WHERE "Id" = 'e1cf519b-c8dd-40ab-aaee-0629c210e888';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c9e7f4ab-780b-4417-a553-9329fa6de722', '+201094442301', true, '2026-06-13 15:14:55', '2026-06-13 15:14:55', 'e1cf519b-c8dd-40ab-aaee-0629c210e888') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+218911178727', "PhoneNumberConfirmed" = true WHERE "Id" = 'c1c039e5-01c9-4219-a4ba-72b264372ab6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f632e50c-f8ab-4f1e-bfe3-569577b051e3', '+218911178727', true, '2026-02-19 18:54:23', '2026-02-19 18:54:23', 'c1c039e5-01c9-4219-a4ba-72b264372ab6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001517352', "PhoneNumberConfirmed" = true WHERE "Id" = '2bb79f86-0700-4790-a001-5226006940b8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f9a41ec9-82ad-40b1-abe5-64f6217e0e51', '+201001517352', true, '2026-02-19 11:02:06', '2026-02-19 11:02:06', '2bb79f86-0700-4790-a001-5226006940b8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001516253', "PhoneNumberConfirmed" = true WHERE "Id" = '928ed1e0-0b80-4862-b0bd-3f54caa8ab86';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7ccecd35-3dd0-4aa5-9540-67fa94f08473', '+201001516253', true, '2026-02-19 11:26:05', '2026-02-19 11:26:05', '928ed1e0-0b80-4862-b0bd-3f54caa8ab86') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030852613', "PhoneNumberConfirmed" = true WHERE "Id" = '2d8eb834-735d-478c-9bfc-1e77501cf62b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0447c66c-e813-4ac5-a8ef-2159590a18e8', '+201030852613', true, '2026-02-19 13:42:05', '2026-02-19 13:42:05', '2d8eb834-735d-478c-9bfc-1e77501cf62b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201116619227', "PhoneNumberConfirmed" = true WHERE "Id" = 'b5b322ee-420b-4cce-b293-028904d04c2d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c64fb361-c7c0-4393-b61a-52dbb3642338', '+201116619227', true, '2026-02-19 13:55:23', '2026-02-19 13:55:23', 'b5b322ee-420b-4cce-b293-028904d04c2d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966552113394', "PhoneNumberConfirmed" = true WHERE "Id" = 'bdd1b634-f63f-43b9-95fe-855f8fbfeff2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('55def172-22f8-42c7-a4fe-7ff6d805154a', '+966552113394', true, '2026-02-19 16:15:01', '2026-02-19 16:15:01', 'bdd1b634-f63f-43b9-95fe-855f8fbfeff2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003876350', "PhoneNumberConfirmed" = true WHERE "Id" = '78d92a87-22bb-4c0f-af46-39da4d8b942e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('31584f1b-d7d4-4d45-bb58-8d4659dff30e', '+201003876350', true, '2026-02-19 16:40:58', '2026-02-19 16:40:58', '78d92a87-22bb-4c0f-af46-39da4d8b942e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201001201575', "PhoneNumberConfirmed" = true WHERE "Id" = '0fbde09f-e568-4f48-88d1-b55f4c435bc2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ac04ab7e-d316-4a2b-bffe-8b46e65ccc38', '+201001201575', true, '2026-02-19 16:47:12', '2026-02-19 16:47:12', '0fbde09f-e568-4f48-88d1-b55f4c435bc2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201016171006', "PhoneNumberConfirmed" = true WHERE "Id" = '3a9b5cc3-5f6d-439a-9cf8-9526065b8a47';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8f014bc7-0fc5-48c4-bb21-53c0213eed79', '+201016171006', true, '2026-02-19 17:17:23', '2026-02-19 17:17:23', '3a9b5cc3-5f6d-439a-9cf8-9526065b8a47') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201142706880', "PhoneNumberConfirmed" = true WHERE "Id" = 'e6400b94-9def-4a72-b6ac-8ff6aba2265f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b2c422c4-34ab-4049-9871-7d2d9fe5fca6', '+201142706880', true, '2026-04-15 00:28:54', '2026-04-15 00:28:54', 'e6400b94-9def-4a72-b6ac-8ff6aba2265f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091939888', "PhoneNumberConfirmed" = true WHERE "Id" = 'd54fb349-133a-45e7-b9f9-bfe66449817b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8f4141fb-d565-4069-90fb-03a0c7ff1337', '+201091939888', true, '2026-02-19 19:55:23', '2026-02-19 19:55:23', 'd54fb349-133a-45e7-b9f9-bfe66449817b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025843644', "PhoneNumberConfirmed" = true WHERE "Id" = '14b0ae92-e592-4b4b-a4c1-51340b5b5a68';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dddaf98b-1dcd-4722-95c6-6ddf51dab92d', '+201025843644', true, '2026-04-29 07:14:36', '2026-04-29 07:14:36', '14b0ae92-e592-4b4b-a4c1-51340b5b5a68') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01201199526', "PhoneNumberConfirmed" = true WHERE "Id" = '1e4a89b8-fa0b-4a42-8d6b-286616ffa98e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('57ed7893-3247-4d5f-987c-5ffd9b97af4d', '01201199526', true, '2026-02-19 21:42:39', '2026-02-19 21:42:39', '1e4a89b8-fa0b-4a42-8d6b-286616ffa98e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003350019', "PhoneNumberConfirmed" = true WHERE "Id" = '7a37e9dd-1405-437c-8857-cbdde98d5241';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fd35bfd7-4f3b-462b-8f67-c7f3d38bb7af', '+201003350019', true, '2026-02-20 09:16:15', '2026-02-20 09:16:15', '7a37e9dd-1405-437c-8857-cbdde98d5241') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201227720873', "PhoneNumberConfirmed" = true WHERE "Id" = 'b0fdcb5d-5bc0-4061-8d45-20f000c4b4e7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('14f71454-852f-481a-bd26-7c34531ae017', '+201227720873', true, '2026-02-20 11:20:58', '2026-02-20 11:20:58', 'b0fdcb5d-5bc0-4061-8d45-20f000c4b4e7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025348564', "PhoneNumberConfirmed" = true WHERE "Id" = '6c5be232-9df1-4fde-9749-fcd69aae1d52';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('100f0c40-6dbd-42a6-89c1-bb3bc9699b70', '+201025348564', true, '2026-02-20 10:38:56', '2026-02-20 10:38:56', '6c5be232-9df1-4fde-9749-fcd69aae1d52') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201126909155', "PhoneNumberConfirmed" = true WHERE "Id" = '2581f116-14f6-4618-9e47-7c8b3e399497';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c762423e-ae1f-4f1b-bcc8-a4c4be06d639', '+201126909155', true, '2026-02-20 00:43:47', '2026-02-20 00:43:47', '2581f116-14f6-4618-9e47-7c8b3e399497') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066598747', "PhoneNumberConfirmed" = true WHERE "Id" = '9d32e22b-e199-484a-829f-357578b8f17e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d2be233d-2fe9-48e6-bcf5-98b88f9e1542', '+201066598747', true, '2026-02-20 11:02:20', '2026-02-20 11:02:20', '9d32e22b-e199-484a-829f-357578b8f17e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002310222', "PhoneNumberConfirmed" = true WHERE "Id" = '0891eb56-370b-4eb4-b5c0-515111f23e4d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('aebc0a22-2a1e-4371-91d7-ba35bdcd22c3', '+201002310222', true, '2026-02-20 12:18:55', '2026-02-20 12:18:55', '0891eb56-370b-4eb4-b5c0-515111f23e4d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201027117434', "PhoneNumberConfirmed" = true WHERE "Id" = '00af5787-427c-435f-9b4a-836a0c79db57';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('53f1f34d-f6fc-4cff-8d2b-2ad948255da6', '+201027117434', true, '2026-02-20 14:24:48', '2026-02-20 14:24:48', '00af5787-427c-435f-9b4a-836a0c79db57') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201027821888', "PhoneNumberConfirmed" = true WHERE "Id" = 'e02abdee-987e-4cc5-9db0-7cdcae8b9983';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1461a46f-3cee-402f-b31c-024a72088677', '+201027821888', true, '2026-02-20 15:13:17', '2026-02-20 15:13:17', 'e02abdee-987e-4cc5-9db0-7cdcae8b9983') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201589652365', "PhoneNumberConfirmed" = true WHERE "Id" = '620d3d11-27c8-4829-a7b0-2edcc68a5ca6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c48aff8a-788c-4ca9-b633-795c1b3f2323', '+201589652365', true, '2026-02-20 16:47:05', '2026-02-20 16:47:05', '620d3d11-27c8-4829-a7b0-2edcc68a5ca6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201125762584', "PhoneNumberConfirmed" = true WHERE "Id" = 'ba4e0c40-2dc2-4538-ac51-f388d2192680';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0c9c465d-346d-4c0a-9450-f5bb73081e44', '+201125762584', true, '2026-02-19 18:26:20', '2026-02-19 18:26:20', 'ba4e0c40-2dc2-4538-ac51-f388d2192680') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201544203369', "PhoneNumberConfirmed" = true WHERE "Id" = 'b46635d9-a40f-4f8a-856d-dc75896c2a83';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('623409f8-4491-4b5b-ba97-886d9ed7cb05', '+201544203369', true, '2026-02-20 19:34:09', '2026-02-20 19:34:09', 'b46635d9-a40f-4f8a-856d-dc75896c2a83') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18622354954', "PhoneNumberConfirmed" = true WHERE "Id" = '7d6deee7-c05a-47df-a0be-d6aac9c25899';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('38e691d9-7489-4787-9629-d20e2ef7b074', '+18622354954', true, '2026-02-20 19:47:01', '2026-02-20 19:47:01', '7d6deee7-c05a-47df-a0be-d6aac9c25899') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201277170079', "PhoneNumberConfirmed" = true WHERE "Id" = '3d737765-b70a-4334-9943-050568ec4697';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bfeae0c5-d1e8-4b7a-a781-652b9581dc90', '+201277170079', true, '2026-02-21 16:22:29', '2026-02-21 16:22:29', '3d737765-b70a-4334-9943-050568ec4697') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201033256325', "PhoneNumberConfirmed" = true WHERE "Id" = '9a2a7dcc-df46-4f1a-8e18-2685c30fdd93';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9911e52e-8529-4d65-8042-6a095c3db4bc', '+201033256325', true, '2026-02-20 19:48:30', '2026-02-20 19:48:30', '9a2a7dcc-df46-4f1a-8e18-2685c30fdd93') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201201015040', "PhoneNumberConfirmed" = true WHERE "Id" = 'b0465289-1b2d-4db5-bd20-f782b917c655';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1aa72ee1-751f-438a-93fc-5fbd53ae620e', '+201201015040', true, '2026-02-20 19:59:47', '2026-02-20 19:59:47', 'b0465289-1b2d-4db5-bd20-f782b917c655') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061047878', "PhoneNumberConfirmed" = true WHERE "Id" = '318c7efb-0cfd-4d61-b853-cbabcc00a2f3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('165b8ad7-8a75-4a0d-a3da-5785383ee027', '+201061047878', true, '2026-05-02 02:14:29', '2026-05-02 02:14:29', '318c7efb-0cfd-4d61-b853-cbabcc00a2f3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010326839', "PhoneNumberConfirmed" = true WHERE "Id" = '18e3898a-fc08-494b-839f-c62020064a5e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b813cf63-4186-47f8-8c5f-38fb133868ca', '+201010326839', true, '2026-04-29 22:03:31', '2026-04-29 22:03:31', '18e3898a-fc08-494b-839f-c62020064a5e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201011519731', "PhoneNumberConfirmed" = true WHERE "Id" = 'dfd7d03b-ea83-4c3c-83ff-2c055d6f5ba4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dfb0c4c7-7eb3-4873-8c04-5b555673f7b6', '+201011519731', true, '2026-02-23 21:10:17', '2026-02-23 21:10:17', 'dfd7d03b-ea83-4c3c-83ff-2c055d6f5ba4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201063288742', "PhoneNumberConfirmed" = true WHERE "Id" = '855a66ac-6612-4b09-9934-a31a46a3ee43';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('201030c1-f14b-445b-9aef-2b13bf78581c', '+201063288742', true, '2026-02-24 14:19:22', '2026-02-24 14:19:22', '855a66ac-6612-4b09-9934-a31a46a3ee43') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201225165087', "PhoneNumberConfirmed" = true WHERE "Id" = 'fa7a986f-70d7-4073-a8a8-4867d3f0fd52';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b70a5377-b704-48a9-b4ce-98de46e3accc', '+201225165087', true, '2026-02-21 09:23:29', '2026-02-21 09:23:29', 'fa7a986f-70d7-4073-a8a8-4867d3f0fd52') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201096523287', "PhoneNumberConfirmed" = true WHERE "Id" = 'c5ac8199-63e7-4b2d-ba86-207e9a77eb7c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('15e1aa40-7c17-4b82-8526-be327363b4f1', '+201096523287', true, '2026-02-23 04:28:00', '2026-02-23 04:28:00', 'c5ac8199-63e7-4b2d-ba86-207e9a77eb7c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201063288685', "PhoneNumberConfirmed" = true WHERE "Id" = '376f3334-0113-4ec1-bf52-f228d4a2c5b8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b94ce340-a04a-4bda-bfd5-1e878e5cb6fa', '+201063288685', true, '2026-02-23 04:32:23', '2026-02-23 04:32:23', '376f3334-0113-4ec1-bf52-f228d4a2c5b8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067477772', "PhoneNumberConfirmed" = true WHERE "Id" = 'd9b58616-df4b-4435-bfcf-2cc555e25c7f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ee59a5f5-7b50-4c2f-924f-0442cda93c68', '+201067477772', true, '2026-02-24 13:33:30', '2026-02-24 13:33:30', 'd9b58616-df4b-4435-bfcf-2cc555e25c7f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201096585255', "PhoneNumberConfirmed" = true WHERE "Id" = 'e81557eb-01dd-480b-b572-2b58fa8c13bb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c84c270c-471b-4209-9556-6d1ec3862e86', '+201096585255', true, '2026-02-24 13:31:45', '2026-02-24 13:31:45', 'e81557eb-01dd-480b-b572-2b58fa8c13bb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201005174008', "PhoneNumberConfirmed" = true WHERE "Id" = 'de32a664-bdeb-4b72-81d2-08c68fdf47bc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cfb9093a-f1a6-4d0a-b692-0332941430ce', '+201005174008', true, '2026-02-24 21:02:40', '2026-02-24 21:02:40', 'de32a664-bdeb-4b72-81d2-08c68fdf47bc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066702747', "PhoneNumberConfirmed" = true WHERE "Id" = '1c52dd71-a0e8-44b3-a11b-7a01333268c8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1fc16d55-d1c3-41a5-a050-f6bc8c94be66', '+201066702747', true, '2026-02-25 00:23:20', '2026-02-25 00:23:20', '1c52dd71-a0e8-44b3-a11b-7a01333268c8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201221949673', "PhoneNumberConfirmed" = true WHERE "Id" = '3880dcad-e512-49e7-9242-c0f98ad5d1c1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d3690507-7114-4a72-87c7-738d81c00986', '+201221949673', true, '2026-06-04 19:08:03', '2026-06-04 19:08:03', '3880dcad-e512-49e7-9242-c0f98ad5d1c1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064019369', "PhoneNumberConfirmed" = true WHERE "Id" = '15212723-305e-40d9-8607-7a80b515b76d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c14cb952-8370-4f4f-b601-0a25b8aca379', '+201064019369', true, '2026-05-03 02:06:08', '2026-05-03 02:06:08', '15212723-305e-40d9-8607-7a80b515b76d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201063289655', "PhoneNumberConfirmed" = true WHERE "Id" = 'b945b170-a87d-413b-a06a-e6bae86021de';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ac8b9f02-e672-433d-b2fa-1fa58047f0ef', '+201063289655', true, '2026-02-24 15:49:25', '2026-02-24 15:49:25', 'b945b170-a87d-413b-a06a-e6bae86021de') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01091027725', "PhoneNumberConfirmed" = true WHERE "Id" = 'a019a096-32a2-489e-a550-d0396d4bb26f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0fad0eaa-1f46-4f2e-8c07-12d8f3d5b596', '01091027725', true, '2026-02-24 13:19:49', '2026-02-24 13:19:49', 'a019a096-32a2-489e-a550-d0396d4bb26f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201125461589', "PhoneNumberConfirmed" = true WHERE "Id" = '109f9dae-dddf-4885-ba5d-8e832f783974';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('84c8a03b-7cc7-4cfb-9c9d-13647e169901', '+201125461589', true, '2026-03-04 15:29:49', '2026-03-04 15:29:49', '109f9dae-dddf-4885-ba5d-8e832f783974') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201244587878', "PhoneNumberConfirmed" = true WHERE "Id" = 'aca3a4c1-79db-40cf-b12d-941b8c558cbf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e55d5838-4943-4f42-9f8a-50cc7aee923b', '+201244587878', true, '2026-03-04 15:39:30', '2026-03-04 15:39:30', 'aca3a4c1-79db-40cf-b12d-941b8c558cbf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+20 12 75372280', "PhoneNumberConfirmed" = true WHERE "Id" = '43a3e1f4-3ad0-4012-9e6b-7f2e11b8531d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cc9e0e56-0ec2-46c1-aa8c-19b24f8bfca9', '+20 12 75372280', true, '2026-05-01 01:47:20', '2026-05-01 01:47:20', '43a3e1f4-3ad0-4012-9e6b-7f2e11b8531d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18049660127', "PhoneNumberConfirmed" = true WHERE "Id" = 'b1d9ef05-7e56-44c3-bb72-220620341f8a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fd2b5945-2bcc-431e-8ea7-7305c675a2e0', '+18049660127', true, '2026-03-06 12:39:58', '2026-03-06 12:39:58', 'b1d9ef05-7e56-44c3-bb72-220620341f8a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201111145578', "PhoneNumberConfirmed" = true WHERE "Id" = '21f7a40c-af58-4808-888b-b0f8587bd0cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('87416baa-332f-4d62-a114-16a73b56c9bd', '+201111145578', true, '2026-03-04 15:46:15', '2026-03-04 15:46:15', '21f7a40c-af58-4808-888b-b0f8587bd0cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201032634644', "PhoneNumberConfirmed" = true WHERE "Id" = 'fe4d7359-ed2f-4848-bd70-8a012b5668ec';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8f0c962e-bb76-4115-8b42-0a777866412e', '+201032634644', true, '2026-03-04 18:14:56', '2026-03-04 18:14:56', 'fe4d7359-ed2f-4848-bd70-8a012b5668ec') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201110792813', "PhoneNumberConfirmed" = true WHERE "Id" = 'fb0653ba-ad25-4a0b-a000-492f6ee2a0a8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('61a1064f-f0bd-47e1-8d46-61dc2efd74f9', '+201110792813', true, '2026-02-27 21:30:30', '2026-02-27 21:30:30', 'fb0653ba-ad25-4a0b-a000-492f6ee2a0a8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030229082', "PhoneNumberConfirmed" = true WHERE "Id" = 'f945c125-b367-4b02-8731-cf4e34ed2c33';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('aeebd536-ec8f-4909-9887-4477551e3669', '+201030229082', true, '2026-02-28 19:37:58', '2026-02-28 19:37:58', 'f945c125-b367-4b02-8731-cf4e34ed2c33') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01067980959', "PhoneNumberConfirmed" = true WHERE "Id" = '67a4f342-b90d-4c55-ab8b-9b40c2d7d853';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2ad3ae41-7e62-4517-8943-8ae33b482aa1', '01067980959', true, '2026-02-28 22:20:38', '2026-02-28 22:20:38', '67a4f342-b90d-4c55-ab8b-9b40c2d7d853') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201006103607', "PhoneNumberConfirmed" = true WHERE "Id" = '727100de-510f-4d63-a299-d3cb5847f678';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bf7d5802-5b5c-45cc-9e73-744011d24b95', '+201006103607', true, '2026-03-01 15:28:02', '2026-03-01 15:28:02', '727100de-510f-4d63-a299-d3cb5847f678') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201141179354', "PhoneNumberConfirmed" = true WHERE "Id" = '4da0d0b7-6b4a-433f-b5ea-4558208976db';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('33fbc1d8-1b36-4608-8944-afad9d5c05ed', '+201141179354', true, '2026-03-01 16:48:10', '2026-03-01 16:48:10', '4da0d0b7-6b4a-433f-b5ea-4558208976db') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201124994803', "PhoneNumberConfirmed" = true WHERE "Id" = 'dc3d7fab-acb7-4390-b009-8bba57fe36e7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e4a04ec1-9d64-400d-b3cf-31b134220a3e', '+201124994803', true, '2026-03-10 03:21:58', '2026-03-10 03:21:58', 'dc3d7fab-acb7-4390-b009-8bba57fe36e7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+19282850693', "PhoneNumberConfirmed" = true WHERE "Id" = '2e491987-2423-4903-965b-2a2681c64cd2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dcb2014d-7dc0-4ce4-81be-0525ea2dea98', '+19282850693', true, '2026-03-05 15:35:05', '2026-03-05 15:35:05', '2e491987-2423-4903-965b-2a2681c64cd2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201125461585', "PhoneNumberConfirmed" = true WHERE "Id" = '0278a81d-57be-4c92-9007-e04c08f7516c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2c8abd0d-a719-4168-9d9b-ee4706ec6768', '+201125461585', true, '2026-03-05 15:41:28', '2026-03-05 15:41:28', '0278a81d-57be-4c92-9007-e04c08f7516c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18049660128', "PhoneNumberConfirmed" = true WHERE "Id" = 'd45d47aa-ef50-46d6-ae34-09e5a5d6aeb1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('354b7073-5290-493a-85b1-d3a5fba369a2', '+18049660128', true, '2026-03-06 12:45:33', '2026-03-06 12:45:33', 'd45d47aa-ef50-46d6-ae34-09e5a5d6aeb1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201252369658', "PhoneNumberConfirmed" = true WHERE "Id" = 'd20a4261-cd0b-43a8-8ea9-fefd5b176307';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('365f6450-2a5d-49e2-976a-c4e9b134f35e', '+201252369658', true, '2026-03-06 11:21:35', '2026-03-06 11:21:35', 'd20a4261-cd0b-43a8-8ea9-fefd5b176307') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18049660123', "PhoneNumberConfirmed" = true WHERE "Id" = 'a82a5f67-f7ed-4587-99a7-fa1442d1064a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9560fcc5-1308-4a1c-9130-15a5fa3adc2e', '+18049660123', true, '2026-03-06 12:31:39', '2026-03-06 12:31:39', 'a82a5f67-f7ed-4587-99a7-fa1442d1064a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201019450711', "PhoneNumberConfirmed" = true WHERE "Id" = 'f2241903-5551-4989-a9e2-72c4f6e48698';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f94c84a8-093f-435f-97d3-b5901a456fc9', '+201019450711', true, '2026-03-10 17:55:52', '2026-03-10 17:55:52', 'f2241903-5551-4989-a9e2-72c4f6e48698') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18049660144', "PhoneNumberConfirmed" = true WHERE "Id" = 'e3837882-b232-4af4-9823-64b8ee0a1b93';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fc1b0677-6216-4ff6-832c-f963eacb3b43', '+18049660144', true, '2026-03-06 12:52:42', '2026-03-06 12:52:42', 'e3837882-b232-4af4-9823-64b8ee0a1b93') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18049660545', "PhoneNumberConfirmed" = true WHERE "Id" = '3a2f6705-bdbf-4487-923e-5a1f5055fae4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d6e914d8-a528-458e-946c-7817d3c91072', '+18049660545', true, '2026-03-06 12:59:37', '2026-03-06 12:59:37', '3a2f6705-bdbf-4487-923e-5a1f5055fae4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201235684684', "PhoneNumberConfirmed" = true WHERE "Id" = 'b5d4b252-6dfb-46e1-8b6a-e9c608c77526';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bf16df24-0a21-43ce-9b1c-08faba917d97', '+201235684684', true, '2026-03-08 05:07:38', '2026-03-08 05:07:38', 'b5d4b252-6dfb-46e1-8b6a-e9c608c77526') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+19282850321', "PhoneNumberConfirmed" = true WHERE "Id" = '4f04cc26-9d47-4656-8ce9-158a829e37ca';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7fe9ba35-ae8a-4c75-939e-89779bc45a3d', '+19282850321', true, '2026-03-07 11:51:34', '2026-03-07 11:51:34', '4f04cc26-9d47-4656-8ce9-158a829e37ca') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+13345567789', "PhoneNumberConfirmed" = true WHERE "Id" = '847ef025-6020-4927-aad9-39ffb7b65a31';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('78f6f61a-0af5-417a-9193-f99fd5d4dc83', '+13345567789', true, '2026-03-09 10:15:19', '2026-03-09 10:15:19', '847ef025-6020-4927-aad9-39ffb7b65a31') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066867432', "PhoneNumberConfirmed" = true WHERE "Id" = '1fbc8441-6253-4c88-a26b-ecd83cabb0cf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c15e1c0e-5b0e-48d6-a457-3f8c2ea94363', '+201066867432', true, '2026-02-27 14:27:11', '2026-02-27 14:27:11', '1fbc8441-6253-4c88-a26b-ecd83cabb0cf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201115455859', "PhoneNumberConfirmed" = true WHERE "Id" = '5c4e56f8-d53a-4818-80c0-3f5137f72198';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1660448f-93c7-4923-86a4-fa95e8e88627', '+201115455859', true, '2026-03-06 18:57:50', '2026-03-06 18:57:50', '5c4e56f8-d53a-4818-80c0-3f5137f72198') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+19787362203', "PhoneNumberConfirmed" = true WHERE "Id" = '5bf2300c-6a16-43ec-b341-f8e307664f64';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a65f7c4e-69c5-4926-a747-f4d2070bd893', '+19787362203', true, '2026-03-10 20:00:24', '2026-03-10 20:00:24', '5bf2300c-6a16-43ec-b341-f8e307664f64') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201109190716', "PhoneNumberConfirmed" = true WHERE "Id" = '6f8ad7b3-2fdb-4fbe-a53d-b3ac0f5ad33f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3569d307-77f1-41f4-b43f-27643211d3ae', '+201109190716', true, '2026-04-12 16:22:58', '2026-04-12 16:22:58', '6f8ad7b3-2fdb-4fbe-a53d-b3ac0f5ad33f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002506690', "PhoneNumberConfirmed" = true WHERE "Id" = 'ad129c90-f468-4689-b250-199e0e25d7e9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('025a7612-7966-4650-b19a-cffdde83e57c', '+201002506690', true, '2026-03-15 01:04:20', '2026-03-15 01:04:20', 'ad129c90-f468-4689-b250-199e0e25d7e9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002256439', "PhoneNumberConfirmed" = true WHERE "Id" = 'ecfbf9df-0b44-40e8-9d1b-2c6a4b39b60d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('47d7ea54-53d4-498f-b420-128725a31390', '+201002256439', true, '2026-03-17 07:31:27', '2026-03-17 07:31:27', 'ecfbf9df-0b44-40e8-9d1b-2c6a4b39b60d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201123430162', "PhoneNumberConfirmed" = true WHERE "Id" = 'c2fbf8ee-08c6-44e7-907d-3b1a2c3b4015';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('85842e99-7653-4369-9791-6feadac9ba58', '+201123430162', true, '2026-05-14 18:08:24', '2026-05-14 18:08:24', 'c2fbf8ee-08c6-44e7-907d-3b1a2c3b4015') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201202738135', "PhoneNumberConfirmed" = true WHERE "Id" = '1885d796-4065-48fa-97cf-18cc52eeff15';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('581acfe5-c7e8-4c07-8a8d-632d1e0e8925', '+201202738135', true, '2026-03-15 06:25:03', '2026-03-15 06:25:03', '1885d796-4065-48fa-97cf-18cc52eeff15') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201559204156', "PhoneNumberConfirmed" = true WHERE "Id" = '9cf89de4-9c60-4c97-a821-e9aed7774078';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('302037a2-3e02-443c-9b42-2e91d544db6b', '+201559204156', true, '2026-03-15 08:35:26', '2026-03-15 08:35:26', '9cf89de4-9c60-4c97-a821-e9aed7774078') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090209998', "PhoneNumberConfirmed" = true WHERE "Id" = '71ab6bad-5d31-4973-a2fb-d96991c91413';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c7df6849-2394-4da0-b46f-48a45ba9476a', '+201090209998', true, '2026-03-15 11:35:25', '2026-03-15 11:35:25', '71ab6bad-5d31-4973-a2fb-d96991c91413') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064867998', "PhoneNumberConfirmed" = true WHERE "Id" = 'ad986191-bcba-488b-a947-1d2165e57954';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('97f7d459-29c8-4fa1-85bb-31147764a3ab', '+201064867998', true, '2026-03-17 19:52:17', '2026-03-17 19:52:17', 'ad986191-bcba-488b-a947-1d2165e57954') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201226942664', "PhoneNumberConfirmed" = true WHERE "Id" = '34dc16af-09fc-4cab-9265-ce0fa0d49113';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('594d8db4-2d29-49f8-b4ef-d35a6715d566', '+201226942664', true, '2026-04-29 09:33:25', '2026-04-29 09:33:25', '34dc16af-09fc-4cab-9265-ce0fa0d49113') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201023470962', "PhoneNumberConfirmed" = true WHERE "Id" = 'd223de02-87d9-4a41-9c87-85dd305068c7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3d354626-acca-44ee-835e-f76930b447c2', '+201023470962', true, '2026-03-15 20:28:07', '2026-03-15 20:28:07', 'd223de02-87d9-4a41-9c87-85dd305068c7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201033009433', "PhoneNumberConfirmed" = true WHERE "Id" = '5fcf5827-03ab-409f-be78-cebce16fa6ab';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('12483c9b-8943-4f63-854d-72a7ac0817ea', '+201033009433', true, '2026-03-24 05:28:58', '2026-03-24 05:28:58', '5fcf5827-03ab-409f-be78-cebce16fa6ab') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201004840031', "PhoneNumberConfirmed" = true WHERE "Id" = 'c510fb10-fb58-46f0-a709-0455d3d7d898';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f619c16c-9b65-4677-bd6a-c617502d76c8', '+201004840031', true, '2026-04-12 00:29:18', '2026-04-12 00:29:18', 'c510fb10-fb58-46f0-a709-0455d3d7d898') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201225658923', "PhoneNumberConfirmed" = true WHERE "Id" = '75eb1943-6999-4905-954e-1a948c917656';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7d8eed96-d755-4ef2-9b30-0500eac9d985', '+201225658923', true, '2026-03-26 09:49:51', '2026-03-26 09:49:51', '75eb1943-6999-4905-954e-1a948c917656') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201018919116', "PhoneNumberConfirmed" = true WHERE "Id" = 'f3e0d2c0-9c04-4914-99d4-86d915e59206';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9fff0ea1-bd2f-4adb-af39-4e9b0942f1f9', '+201018919116', true, '2026-03-17 21:35:40', '2026-03-17 21:35:40', 'f3e0d2c0-9c04-4914-99d4-86d915e59206') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201069160428', "PhoneNumberConfirmed" = true WHERE "Id" = '99aeb315-0c9f-4a97-aa99-3514fce44ae6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f734cea6-e3c9-4562-bfde-f4f0afc654ba', '+201069160428', true, '2026-03-19 23:16:03', '2026-03-19 23:16:03', '99aeb315-0c9f-4a97-aa99-3514fce44ae6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201256348953', "PhoneNumberConfirmed" = true WHERE "Id" = '59d10849-3ab9-47cf-9fda-024ca5d7cd69';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f240bbf6-d822-4030-b1ac-d8d6f199c7eb', '+201256348953', true, '2026-03-20 17:56:40', '2026-03-20 17:56:40', '59d10849-3ab9-47cf-9fda-024ca5d7cd69') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201145758915', "PhoneNumberConfirmed" = true WHERE "Id" = 'e944cb7d-d71a-454f-9423-ae550a0d89d6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fe07fe51-6697-4018-82bc-43fa73b2c3ee', '+201145758915', true, '2026-04-07 22:49:16', '2026-04-07 22:49:16', 'e944cb7d-d71a-454f-9423-ae550a0d89d6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01011221986', "PhoneNumberConfirmed" = true WHERE "Id" = 'aca02fe3-ddcb-466d-9983-960e0d12e2c3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cca99923-0492-49fe-947e-5ed0511dcde0', '01011221986', true, '2026-03-15 15:32:41', '2026-03-15 15:32:41', 'aca02fe3-ddcb-466d-9983-960e0d12e2c3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201028987592', "PhoneNumberConfirmed" = true WHERE "Id" = '58998714-7d56-41d3-b2e8-8b68b927a083';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3e5702d6-988e-4c5f-8708-d7c20796ef62', '+201028987592', true, '2026-03-16 02:43:31', '2026-03-16 02:43:31', '58998714-7d56-41d3-b2e8-8b68b927a083') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201061709956', "PhoneNumberConfirmed" = true WHERE "Id" = '87593b80-6458-441d-900e-9485163acdd2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('05031a58-7fbe-4e6a-92c6-0333b75acbd5', '+201061709956', true, '2026-04-12 22:15:51', '2026-04-12 22:15:51', '87593b80-6458-441d-900e-9485163acdd2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201062160774', "PhoneNumberConfirmed" = true WHERE "Id" = 'da2a40ef-bacf-4542-af54-03a52022eb43';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9f852f7a-afe8-4ae2-b3ae-55bd589d2856', '+201062160774', true, '2026-04-13 09:08:24', '2026-04-13 09:08:24', 'da2a40ef-bacf-4542-af54-03a52022eb43') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091497095', "PhoneNumberConfirmed" = true WHERE "Id" = 'ba7d4bb4-0626-4e3f-b814-3c4c8dd4b851';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('23a76a45-9a3b-4b37-ad19-64cbd7b9773e', '+201091497095', true, '2026-04-30 14:41:57', '2026-04-30 14:41:57', 'ba7d4bb4-0626-4e3f-b814-3c4c8dd4b851') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021718135', "PhoneNumberConfirmed" = true WHERE "Id" = 'ae7548ce-ade1-441e-b958-bd9566a697b6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0acf262b-98c8-4dbd-a20b-a7fb93cf3d52', '+201021718135', true, '2026-04-12 23:08:54', '2026-04-12 23:08:54', 'ae7548ce-ade1-441e-b958-bd9566a697b6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010462099', "PhoneNumberConfirmed" = true WHERE "Id" = 'a7e313f5-c46d-4b2a-97ed-297c93693ee9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f5dddde5-2617-458a-9d73-12466d11fe2a', '+201010462099', true, '2026-04-14 14:47:21', '2026-04-14 14:47:21', 'a7e313f5-c46d-4b2a-97ed-297c93693ee9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01005528656', "PhoneNumberConfirmed" = true WHERE "Id" = 'eb434863-b357-447f-aadb-5520db2cbe90';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9bf83b6c-55c7-4efc-8a71-2ba66ac7cdb6', '01005528656', true, '2026-02-20 12:13:12', '2026-02-20 12:13:12', 'eb434863-b357-447f-aadb-5520db2cbe90') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201286761605', "PhoneNumberConfirmed" = true WHERE "Id" = 'ed3b4eb8-10cc-4140-82c3-886148771155';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('20f20527-4461-4b8c-9d9c-eeae93f8d8cb', '+201286761605', true, '2026-04-15 14:35:14', '2026-04-15 14:35:14', 'ed3b4eb8-10cc-4140-82c3-886148771155') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050013113', "PhoneNumberConfirmed" = true WHERE "Id" = 'be606a69-64a9-466d-82e1-c2ab3a8cd015';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3690b489-dfed-44e7-ad4b-c5db47d28a29', '+201050013113', true, '2026-04-15 09:57:59', '2026-04-15 09:57:59', 'be606a69-64a9-466d-82e1-c2ab3a8cd015') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+13658889999', "PhoneNumberConfirmed" = true WHERE "Id" = '4e6fd74e-cbfe-4838-a517-0088d55ca2a0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('030c2e4f-4ee2-47af-b50f-a1547202b69c', '+13658889999', true, '2026-05-14 20:47:49', '2026-05-14 20:47:49', '4e6fd74e-cbfe-4838-a517-0088d55ca2a0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201065248731', "PhoneNumberConfirmed" = true WHERE "Id" = '24d04bcd-6948-470c-9fdf-f601d0a35025';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4eb3cd0a-5c01-41d1-a315-6ed14b3244de', '+201065248731', true, '2026-02-11 22:26:23', '2026-02-11 22:26:23', '24d04bcd-6948-470c-9fdf-f601d0a35025') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099221936', "PhoneNumberConfirmed" = true WHERE "Id" = 'f3b5350b-b139-4d8c-90fb-c7a1c07e8629';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('264c00ab-a900-438a-a796-152504bfac37', '+201099221936', true, '2026-04-13 18:44:22', '2026-04-13 18:44:22', 'f3b5350b-b139-4d8c-90fb-c7a1c07e8629') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201116953577', "PhoneNumberConfirmed" = true WHERE "Id" = '93be998f-6acd-48ef-8cda-74c26323e911';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('73b597d8-fa53-478d-9ed9-3d535dc00afb', '+201116953577', true, '2026-04-08 17:31:07', '2026-04-08 17:31:07', '93be998f-6acd-48ef-8cda-74c26323e911') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201020749448', "PhoneNumberConfirmed" = true WHERE "Id" = 'bd03324b-f4eb-4f31-807a-ae8b56652359';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('004588b6-b077-48be-a42a-a389790bd4e4', '+201020749448', true, '2026-04-13 19:33:30', '2026-04-13 19:33:30', 'bd03324b-f4eb-4f31-807a-ae8b56652359') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201550046660', "PhoneNumberConfirmed" = true WHERE "Id" = 'f599ba43-2415-4afe-ab26-78905bf1d4e7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e3257f73-6e60-4982-9982-e74ca09e111f', '+201550046660', true, '2025-12-29 19:46:25', '2025-12-29 19:46:25', 'f599ba43-2415-4afe-ab26-78905bf1d4e7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+212629408054', "PhoneNumberConfirmed" = true WHERE "Id" = 'b439b8b6-3503-432d-827c-32b92b7abeb1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6b419a3b-e1cd-435d-a3a2-49274638e4ea', '+212629408054', true, '2026-05-18 02:15:51', '2026-05-18 02:15:51', 'b439b8b6-3503-432d-827c-32b92b7abeb1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000966433', "PhoneNumberConfirmed" = true WHERE "Id" = 'c4cb7ef8-8d24-4f43-8603-26c87ed92d35';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1f7a71f6-569c-4c9f-b472-3d6e9a8751b3', '+201000966433', true, '2026-04-14 17:38:06', '2026-04-14 17:38:06', 'c4cb7ef8-8d24-4f43-8603-26c87ed92d35') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01558623818', "PhoneNumberConfirmed" = true WHERE "Id" = '9333c4fd-9780-4cff-a3e8-625e7412fa6f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e538479a-d935-4f4f-8500-a2b6a1b6c390', '01558623818', true, '2025-12-17 18:25:38', '2025-12-17 18:25:38', '9333c4fd-9780-4cff-a3e8-625e7412fa6f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966510257304', "PhoneNumberConfirmed" = true WHERE "Id" = '70c58efd-cefe-4edb-bceb-0172c01aeb23';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('64632b95-5423-4ccc-b2bd-f427d6b6f714', '+966510257304', true, '2026-05-18 17:10:46', '2026-05-18 17:10:46', '70c58efd-cefe-4edb-bceb-0172c01aeb23') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201110000000', "PhoneNumberConfirmed" = true WHERE "Id" = '4770053e-1fbc-48bf-987b-05e40475e9b4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e31c152c-3a2f-4c99-aa76-6a1d63e24bef', '+201110000000', true, '2026-05-03 02:17:01', '2026-05-03 02:17:01', '4770053e-1fbc-48bf-987b-05e40475e9b4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+12086395635', "PhoneNumberConfirmed" = true WHERE "Id" = 'c562120c-f37b-43f0-9ca7-4586e8fd457f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('416b9e2d-b570-4993-a9f0-a81a40738440', '+12086395635', true, '2026-05-18 23:44:33', '2026-05-18 23:44:33', 'c562120c-f37b-43f0-9ca7-4586e8fd457f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201553593868', "PhoneNumberConfirmed" = true WHERE "Id" = '7b3038f7-ac0d-4260-a488-7946ec3c4376';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1931df94-de95-4924-bb62-df60b6d0f143', '+201553593868', true, '2025-09-15 15:25:10', '2025-09-15 15:25:10', '7b3038f7-ac0d-4260-a488-7946ec3c4376') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213654086417', "PhoneNumberConfirmed" = true WHERE "Id" = '15aaa239-c027-4fd7-97b1-145ce84b9b23';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f1b7cedc-b495-45dd-97b3-b715e40f0666', '+213654086417', true, '2026-05-19 21:36:44', '2026-05-19 21:36:44', '15aaa239-c027-4fd7-97b1-145ce84b9b23') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066720636', "PhoneNumberConfirmed" = true WHERE "Id" = '884e28d4-feea-4b4a-8360-01a2d232a438';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cb1fe8a7-075b-4018-8e0d-e7c08715dc2d', '+201066720636', true, '2026-04-08 21:40:50', '2026-04-08 21:40:50', '884e28d4-feea-4b4a-8360-01a2d232a438') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201207218672', "PhoneNumberConfirmed" = true WHERE "Id" = 'd5893f57-8f81-459c-bf36-012d97a29356';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1f12ad69-5778-4233-b12b-143bb0096bc2', '+201207218672', true, '2026-03-31 12:42:19', '2026-03-31 12:42:19', 'd5893f57-8f81-459c-bf36-012d97a29356') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010161330', "PhoneNumberConfirmed" = true WHERE "Id" = '9374510c-e121-400f-b4c0-168def254528';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fd40a286-b62c-41cd-8ddc-49c0dba10383', '+201010161330', true, '2026-04-14 17:05:41', '2026-04-14 17:05:41', '9374510c-e121-400f-b4c0-168def254528') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201112321246', "PhoneNumberConfirmed" = true WHERE "Id" = '44685b40-301e-4d58-95c1-57fc92485b79';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f0d8808f-b595-4689-82d4-07daeb161880', '+201112321246', true, '2026-04-14 12:03:37', '2026-04-14 12:03:37', '44685b40-301e-4d58-95c1-57fc92485b79') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01019020372', "PhoneNumberConfirmed" = true WHERE "Id" = 'fb59c675-d612-4e5e-b4fb-f793659b5c15';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4afbd41d-8e21-4036-8779-dfb054db4bcc', '01019020372', true, '2026-02-17 18:27:56', '2026-02-17 18:27:56', 'fb59c675-d612-4e5e-b4fb-f793659b5c15') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201012857286', "PhoneNumberConfirmed" = true WHERE "Id" = 'bc8ef50b-9c60-4109-baea-ef7a9f9e418c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('eddb642f-371b-43eb-81e9-aa2dda1722e6', '+201012857286', true, '2026-04-13 20:58:01', '2026-04-13 20:58:01', 'bc8ef50b-9c60-4109-baea-ef7a9f9e418c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067812305', "PhoneNumberConfirmed" = true WHERE "Id" = '0325e853-1d77-49be-af78-aa926c08c2d4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e50bb5bf-a91a-4b0b-b470-cd47be7c2617', '+201067812305', true, '2026-04-08 14:52:47', '2026-04-08 14:52:47', '0325e853-1d77-49be-af78-aa926c08c2d4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966570579005', "PhoneNumberConfirmed" = true WHERE "Id" = '82c49349-7519-46d2-8fba-855188ddaa16';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1674a606-efb9-4f11-a909-1e99198aa5ed', '+966570579005', true, '2026-05-17 21:17:34', '2026-05-17 21:17:34', '82c49349-7519-46d2-8fba-855188ddaa16') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090367962', "PhoneNumberConfirmed" = true WHERE "Id" = '5c8bef53-14c7-4560-98d3-ad872cc7356c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bfc1cd29-dba5-4176-ac0f-c797d4250f82', '+201090367962', true, '2026-04-13 14:55:07', '2026-04-13 14:55:07', '5c8bef53-14c7-4560-98d3-ad872cc7356c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022524091', "PhoneNumberConfirmed" = true WHERE "Id" = 'd92ce9c8-3f93-4194-9b90-8a543b2c35bf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f16e30d5-5f67-4b45-9c00-26a1a71eb1d9', '+201022524091', true, '2026-04-09 02:10:39', '2026-04-09 02:10:39', 'd92ce9c8-3f93-4194-9b90-8a543b2c35bf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01055891015', "PhoneNumberConfirmed" = true WHERE "Id" = 'afd015a2-9a9f-412b-8f5e-fe0f878a1c6c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b27445f3-368c-492c-a3e1-b7a48166ddb5', '01055891015', true, '2026-02-17 03:20:25', '2026-02-17 03:20:25', 'afd015a2-9a9f-412b-8f5e-fe0f878a1c6c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01023650197', "PhoneNumberConfirmed" = true WHERE "Id" = 'bc960707-2556-4304-b1a8-0c746c0e2069';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3e127f8e-3e44-4fbe-bc60-25787ee87238', '01023650197', true, '2026-04-13 18:33:47', '2026-04-13 18:33:47', 'bc960707-2556-4304-b1a8-0c746c0e2069') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+971502164951', "PhoneNumberConfirmed" = true WHERE "Id" = '74604e09-9d36-456b-bde2-fca017ad0ec2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('97951173-e55a-4b6f-ae86-9960209bb874', '+971502164951', true, '2026-05-18 07:25:21', '2026-05-18 07:25:21', '74604e09-9d36-456b-bde2-fca017ad0ec2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000250720', "PhoneNumberConfirmed" = true WHERE "Id" = 'd8a28842-f57c-4f57-86ad-d7fdaca1748d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('51ff4840-5816-4d1e-82ce-48f24b51fd58', '+201000250720', true, '2026-04-12 23:36:01', '2026-04-12 23:36:01', 'd8a28842-f57c-4f57-86ad-d7fdaca1748d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01003493367', "PhoneNumberConfirmed" = true WHERE "Id" = '445feaee-7501-4bd2-9ff8-7eaac91d7c70';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('21145059-e5f8-434f-a8cf-00a7d8499645', '01003493367', true, '2026-02-20 19:38:28', '2026-02-20 19:38:28', '445feaee-7501-4bd2-9ff8-7eaac91d7c70') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201207733183', "PhoneNumberConfirmed" = true WHERE "Id" = '869e3cf8-fa63-47d3-a7f7-2971000bf79c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7da9a3e5-a0e4-493e-ac38-23cd285f2c84', '+201207733183', true, '2026-04-14 13:57:17', '2026-04-14 13:57:17', '869e3cf8-fa63-47d3-a7f7-2971000bf79c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066678226', "PhoneNumberConfirmed" = true WHERE "Id" = '06c0f1dd-f916-4464-8a3b-59471b5863b2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('105087b8-fa4b-435a-b421-c1537b9bfb30', '+201066678226', true, '2026-05-05 08:39:32', '2026-05-05 08:39:32', '06c0f1dd-f916-4464-8a3b-59471b5863b2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099183431', "PhoneNumberConfirmed" = true WHERE "Id" = '6c89b780-3d77-439b-a900-bf468056f665';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('78273086-6bde-4bcd-8cc2-ac9d8721c4b8', '+201099183431', true, '2026-05-05 13:29:53', '2026-05-05 13:29:53', '6c89b780-3d77-439b-a900-bf468056f665') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201013423980', "PhoneNumberConfirmed" = true WHERE "Id" = '2614eb64-4ff8-4774-a993-57536aa9409d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ae279081-2a3b-4eb5-8eaf-e158c95eb7e5', '+201013423980', true, '2026-04-08 11:55:57', '2026-04-08 11:55:57', '2614eb64-4ff8-4774-a993-57536aa9409d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201094472678', "PhoneNumberConfirmed" = true WHERE "Id" = '176905bc-f326-4804-a6e0-bfcfe93814c8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f5929861-1dc3-4b90-8cf1-c0649253b54a', '+201094472678', true, '2026-04-13 09:48:49', '2026-04-13 09:48:49', '176905bc-f326-4804-a6e0-bfcfe93814c8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201282033830', "PhoneNumberConfirmed" = true WHERE "Id" = 'bb94924a-181d-4419-a82f-6a9e0d2410a4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('822e4ef7-e370-4ac7-8207-ca8d56112d91', '+201282033830', true, '2026-05-07 01:05:48', '2026-05-07 01:05:48', 'bb94924a-181d-4419-a82f-6a9e0d2410a4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213560152613', "PhoneNumberConfirmed" = true WHERE "Id" = '006036ca-bb6b-44ef-b7e8-5d064461d3f2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ad7db7c4-fa97-41e0-b838-668021909cb7', '+213560152613', true, '2026-05-18 09:50:07', '2026-05-18 09:50:07', '006036ca-bb6b-44ef-b7e8-5d064461d3f2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201031402441', "PhoneNumberConfirmed" = true WHERE "Id" = '32635b49-6f84-4ffa-bbc8-e6757e2b84b1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a3ec37e6-03bc-4c16-b1dd-848123f0bd80', '+201031402441', true, '2026-04-30 19:24:05', '2026-04-30 19:24:05', '32635b49-6f84-4ffa-bbc8-e6757e2b84b1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222531532', "PhoneNumberConfirmed" = true WHERE "Id" = '2ffe4e41-a71b-48c1-a227-9d208f650bf8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1ef14cfc-6f10-4938-98aa-3ee6eecb50a8', '+201222531532', true, '2026-01-17 10:34:35', '2026-01-17 10:34:35', '2ffe4e41-a71b-48c1-a227-9d208f650bf8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201066349107', "PhoneNumberConfirmed" = true WHERE "Id" = 'eb6002d6-2b22-499e-b629-71877dbeb274';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('77ba7ea3-6091-4359-9fe5-ed26c0610ba5', '+201066349107', true, '2026-04-13 19:47:51', '2026-04-13 19:47:51', 'eb6002d6-2b22-499e-b629-71877dbeb274') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201014623377', "PhoneNumberConfirmed" = true WHERE "Id" = '68c23173-f650-4941-bea4-f4573d4eb21a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e4d008db-5ede-4154-9a91-50db8dee9e34', '+201014623377', true, '2026-05-04 12:39:06', '2026-05-04 12:39:06', '68c23173-f650-4941-bea4-f4573d4eb21a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+66928052508', "PhoneNumberConfirmed" = true WHERE "Id" = 'd82b1fad-bf08-4e17-a6ce-9ccd514037ff';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('aa56defa-9a4e-4fa8-afcb-dc49b43f7c53', '+66928052508', true, '2026-05-18 18:00:43', '2026-05-18 18:00:43', 'd82b1fad-bf08-4e17-a6ce-9ccd514037ff') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201114656324', "PhoneNumberConfirmed" = true WHERE "Id" = '636144ff-94d9-4006-beed-b769c31fad5a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('24a3a29d-39ce-4b26-b576-aa04e1d04954', '+201114656324', true, '2026-01-10 20:57:59', '2026-01-10 20:57:59', '636144ff-94d9-4006-beed-b769c31fad5a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+19406180398', "PhoneNumberConfirmed" = true WHERE "Id" = 'f0cbf358-c20d-4dd7-a223-bebede70c5cf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('852bde06-3eb7-436a-bc2b-27842cdccff1', '+19406180398', true, '2026-05-25 03:44:46', '2026-05-25 03:44:46', 'f0cbf358-c20d-4dd7-a223-bebede70c5cf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+249112884466', "PhoneNumberConfirmed" = true WHERE "Id" = '56f98756-62c0-4cfd-a6bb-4e09b0c698d1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2954a2ec-092e-4baa-aa1e-5fca33cd080d', '+249112884466', true, '2026-05-19 00:02:33', '2026-05-19 00:02:33', '56f98756-62c0-4cfd-a6bb-4e09b0c698d1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201125461554', "PhoneNumberConfirmed" = true WHERE "Id" = '9f96c444-518e-4d2d-9553-5ef8471ca24f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('480bb019-e60d-45b3-8098-fcf88513d50e', '+201125461554', true, '2026-05-22 11:52:00', '2026-05-22 11:52:00', '9f96c444-518e-4d2d-9553-5ef8471ca24f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201144028805', "PhoneNumberConfirmed" = true WHERE "Id" = '0c3d53c8-5950-4861-a5e7-edc5b9b1de69';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e11a4bba-69ae-49eb-a6f5-9710c141381f', '+201144028805', true, '2026-05-03 06:06:58', '2026-05-03 06:06:58', '0c3d53c8-5950-4861-a5e7-edc5b9b1de69') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201064166664', "PhoneNumberConfirmed" = true WHERE "Id" = '26344687-23cb-40fe-b877-f0c805c4d90f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('25681dc8-e63c-4ddd-89bc-79975151290e', '+201064166664', true, '2026-03-25 20:55:35', '2026-03-25 20:55:35', '26344687-23cb-40fe-b877-f0c805c4d90f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201143022555', "PhoneNumberConfirmed" = true WHERE "Id" = '9efa5349-0503-4028-9d2b-41c50cb450c1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9f24a6ad-e949-4ffe-945e-eafffb3c92a6', '+201143022555', true, '2026-05-08 00:56:00', '2026-05-08 00:56:00', '9efa5349-0503-4028-9d2b-41c50cb450c1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966535305603', "PhoneNumberConfirmed" = true WHERE "Id" = 'eceb19c3-2903-44da-9f39-5b2ee8e80686';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4ed02d3d-98e5-497d-8d63-6c26bbcabe6f', '+966535305603', true, '2026-05-28 16:39:07', '2026-05-28 16:39:07', 'eceb19c3-2903-44da-9f39-5b2ee8e80686') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201555348399', "PhoneNumberConfirmed" = true WHERE "Id" = 'a0c47f3e-39a2-456f-8fc5-0072632991f4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ee250265-d041-437c-8023-1a4bfd61e01c', '+201555348399', true, '2026-02-07 22:33:20', '2026-02-07 22:33:20', 'a0c47f3e-39a2-456f-8fc5-0072632991f4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201017000434', "PhoneNumberConfirmed" = true WHERE "Id" = 'bceee714-efd0-476a-b460-98fd16761801';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6226a21b-9d35-489b-ade1-9f6808e03657', '+201017000434', true, '2026-04-12 03:37:43', '2026-04-12 03:37:43', 'bceee714-efd0-476a-b460-98fd16761801') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201097990124', "PhoneNumberConfirmed" = true WHERE "Id" = '6780e999-b145-42c8-93a8-67c93f4c0a0d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cfe505a8-0f84-47e6-b73b-e128c069e3be', '+201097990124', true, '2026-04-07 21:15:30', '2026-04-07 21:15:30', '6780e999-b145-42c8-93a8-67c93f4c0a0d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201108496015', "PhoneNumberConfirmed" = true WHERE "Id" = '80d2933e-4b55-4a40-a72f-73c595b234fe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9e3b76c4-803e-4e78-8a81-027a05d1a761', '+201108496015', true, '2026-04-07 23:36:06', '2026-04-07 23:36:06', '80d2933e-4b55-4a40-a72f-73c595b234fe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01005229760', "PhoneNumberConfirmed" = true WHERE "Id" = '2c14bf21-ac8e-4ed0-beb2-392b6daf8ce6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('09f9d477-6448-484f-ac0f-e73ee8af02cf', '01005229760', true, '2025-11-30 16:06:42', '2025-11-30 16:06:42', '2c14bf21-ac8e-4ed0-beb2-392b6daf8ce6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201067125950', "PhoneNumberConfirmed" = true WHERE "Id" = '34c1c845-cc3b-4e9c-b288-f4894dd42ef2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7753b787-f5c2-401f-b99e-9c1f0dc7fcb3', '+201067125950', true, '2026-04-14 16:26:48', '2026-04-14 16:26:48', '34c1c845-cc3b-4e9c-b288-f4894dd42ef2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201234567891', "PhoneNumberConfirmed" = true WHERE "Id" = 'c6945042-acde-49e6-bae5-2546590aec92';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3403a893-c7de-4fd9-bc2c-fdefc4e1aac1', '+201234567891', true, '2026-04-12 17:48:47', '2026-04-12 17:48:47', 'c6945042-acde-49e6-bae5-2546590aec92') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201270473499', "PhoneNumberConfirmed" = true WHERE "Id" = '999d06e1-b988-49ea-aeaa-3e7126a6720c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2a85afe0-d1bb-43da-bbe6-8a59969ff54f', '+201270473499', true, '2026-05-04 19:23:58', '2026-05-04 19:23:58', '999d06e1-b988-49ea-aeaa-3e7126a6720c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201289296096', "PhoneNumberConfirmed" = true WHERE "Id" = '26350f8b-8231-44d0-9c2f-5d44b0470f8b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a6fdd90d-e150-4ea8-93a8-bd2939891433', '+201289296096', true, '2026-05-01 19:17:17', '2026-05-01 19:17:17', '26350f8b-8231-44d0-9c2f-5d44b0470f8b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+393515924640', "PhoneNumberConfirmed" = true WHERE "Id" = 'c8ca6f6f-8ed2-4b3c-b8f8-4d43c737fb01';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8fc90d87-9a95-4e37-b884-192f96b16418', '+393515924640', true, '2026-05-17 15:17:03', '2026-05-17 15:17:03', 'c8ca6f6f-8ed2-4b3c-b8f8-4d43c737fb01') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201142187266', "PhoneNumberConfirmed" = true WHERE "Id" = '3e1e1289-8586-4a91-b97b-f9fb94a07c3c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('155f92a5-4ee3-4a29-a5b2-6d1e157bbdef', '+201142187266', true, '2026-05-03 06:23:16', '2026-05-03 06:23:16', '3e1e1289-8586-4a91-b97b-f9fb94a07c3c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000781481', "PhoneNumberConfirmed" = true WHERE "Id" = '1c56f466-b195-4ba0-a37b-44656548f76d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b06800e4-8e6a-46c3-bf88-d6bb1931fb74', '+201000781481', true, '2026-04-04 14:03:35', '2026-04-04 14:03:35', '1c56f466-b195-4ba0-a37b-44656548f76d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01223806556', "PhoneNumberConfirmed" = true WHERE "Id" = '5cb85b1f-28a5-4d05-bb37-e97e38df532e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('32e5028e-a7f9-4d5a-9c29-8c9d37bd5f06', '01223806556', true, '2026-02-21 16:20:56', '2026-02-21 16:20:56', '5cb85b1f-28a5-4d05-bb37-e97e38df532e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201003304541', "PhoneNumberConfirmed" = true WHERE "Id" = '0ce2c324-652a-4600-8089-ddc2d2796a7c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8cf809f6-6f7b-4afd-9511-6d790d6ea66f', '+201003304541', true, '2026-04-29 10:33:27', '2026-04-29 10:33:27', '0ce2c324-652a-4600-8089-ddc2d2796a7c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18765434567', "PhoneNumberConfirmed" = true WHERE "Id" = 'c5d94a14-5e12-4c5b-a433-29b765850257';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bb8c2520-b2fb-4b58-a9b0-aa7f97493925', '+18765434567', true, '2026-05-19 02:47:36', '2026-05-19 02:47:36', 'c5d94a14-5e12-4c5b-a433-29b765850257') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01096718594', "PhoneNumberConfirmed" = true WHERE "Id" = 'd3e5d5af-66ba-4d41-ada4-20dec716f06f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b18a1e6a-2a0d-4acb-8a14-913aa214f00a', '01096718594', true, '2026-02-04 19:23:23', '2026-02-04 19:23:23', 'd3e5d5af-66ba-4d41-ada4-20dec716f06f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213663060973', "PhoneNumberConfirmed" = true WHERE "Id" = '5e28e64a-8e51-4350-9c2d-94296af85e9e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5a60ed99-f2f8-4242-99cd-69f08f6a19dc', '+213663060973', true, '2026-05-20 23:19:21', '2026-05-20 23:19:21', '5e28e64a-8e51-4350-9c2d-94296af85e9e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201096278255', "PhoneNumberConfirmed" = true WHERE "Id" = '1f4476d2-e571-4633-8362-5623e47dfeda';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('043bb4ef-6f29-4828-9158-9ccac6bca1e0', '+201096278255', true, '2026-03-26 17:23:44', '2026-03-26 17:23:44', '1f4476d2-e571-4633-8362-5623e47dfeda') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213795306297', "PhoneNumberConfirmed" = true WHERE "Id" = 'bc27479f-5736-424e-b0cf-6c0fa7a83439';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('03da578b-eca6-4cd6-b365-3bfcdf45d228', '+213795306297', true, '2026-05-25 03:56:32', '2026-05-25 03:56:32', 'bc27479f-5736-424e-b0cf-6c0fa7a83439') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966538511891', "PhoneNumberConfirmed" = true WHERE "Id" = '3fd26268-feaa-4d99-b9d8-970a07a081ca';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7e359f1b-9715-4f50-b18d-41d8fe818f9b', '+966538511891', true, '2026-06-01 12:08:04', '2026-06-01 12:08:04', '3fd26268-feaa-4d99-b9d8-970a07a081ca') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+16465180948', "PhoneNumberConfirmed" = true WHERE "Id" = '5e51356a-37e2-4cae-850d-4ff4e0d7e8b7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('11189e4b-72a0-4c9d-a281-8cadad8274d4', '+16465180948', true, '2026-05-21 06:18:48', '2026-05-21 06:18:48', '5e51356a-37e2-4cae-850d-4ff4e0d7e8b7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201065046633', "PhoneNumberConfirmed" = true WHERE "Id" = 'edd9b5bb-f1d4-4ce3-ab20-daaba81ca461';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('91ae50db-e472-4d4a-83ac-1c559458dbdc', '+201065046633', true, '2026-02-05 00:09:21', '2026-02-05 00:09:21', 'edd9b5bb-f1d4-4ce3-ab20-daaba81ca461') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201271009611', "PhoneNumberConfirmed" = true WHERE "Id" = '9f0e94f2-57c0-4397-bfb4-981a03633694';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0ba715bc-bebc-4db3-9a7e-3137d24b374a', '+201271009611', true, '2026-05-04 01:58:01', '2026-05-04 01:58:01', '9f0e94f2-57c0-4397-bfb4-981a03633694') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201020344022', "PhoneNumberConfirmed" = true WHERE "Id" = '39fd1456-ad22-4eb9-a5cc-22b1f4bb6e95';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5f59d0ae-6fd3-4c32-9a1f-3d7661299d6e', '+201020344022', true, '2026-05-04 13:00:56', '2026-05-04 13:00:56', '39fd1456-ad22-4eb9-a5cc-22b1f4bb6e95') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201094379226', "PhoneNumberConfirmed" = true WHERE "Id" = '7d6bd4e4-fc4f-492d-90b3-b615f3d386af';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7d561ab1-11ce-4ee2-b020-1e16ddc16db2', '+201094379226', true, '2026-05-17 22:05:47', '2026-05-17 22:05:47', '7d6bd4e4-fc4f-492d-90b3-b615f3d386af') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18068989911', "PhoneNumberConfirmed" = true WHERE "Id" = 'e2707d34-e4d4-4e7b-86ff-e8d7bdda6270';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('017c3068-80f5-462c-83c7-82f3f4caa4e5', '+18068989911', true, '2026-05-18 19:16:39', '2026-05-18 19:16:39', 'e2707d34-e4d4-4e7b-86ff-e8d7bdda6270') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+212644609885', "PhoneNumberConfirmed" = true WHERE "Id" = 'efb6037a-4b9f-459a-aef1-248ca81c89e4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('943e2ae1-d56e-4620-a919-0e9758c37594', '+212644609885', true, '2026-05-19 02:48:48', '2026-05-19 02:48:48', 'efb6037a-4b9f-459a-aef1-248ca81c89e4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201206681072', "PhoneNumberConfirmed" = true WHERE "Id" = '03803c98-d2c4-4b0f-9e5b-2c9f618e5441';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7580ff03-a9e8-4f63-8c4e-dfee6a1003a2', '+201206681072', true, '2026-06-04 20:29:36', '2026-06-04 20:29:36', '03803c98-d2c4-4b0f-9e5b-2c9f618e5441') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201285360671', "PhoneNumberConfirmed" = true WHERE "Id" = '314c71f6-e204-4ff4-94cf-73c7b3bd94a9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b32ca5c2-bc9e-4ff2-8d61-eb88cca43dea', '+201285360671', true, '2026-05-22 20:06:56', '2026-05-22 20:06:56', '314c71f6-e204-4ff4-94cf-73c7b3bd94a9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092878778', "PhoneNumberConfirmed" = true WHERE "Id" = 'edd9f35d-b44b-406a-ba65-f1cc66d2ea41';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0b72909e-51df-4ef3-8bc7-8e1611c385e9', '+201092878778', true, '2026-02-07 19:11:04', '2026-02-07 19:11:04', 'edd9f35d-b44b-406a-ba65-f1cc66d2ea41') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966556657215', "PhoneNumberConfirmed" = true WHERE "Id" = 'df3635a0-3717-4098-8e0d-e0716abcb05d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e6f90618-19bb-49c7-b8a7-805076b99483', '+966556657215', true, '2026-06-01 23:12:39', '2026-06-01 23:12:39', 'df3635a0-3717-4098-8e0d-e0716abcb05d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201222771416', "PhoneNumberConfirmed" = true WHERE "Id" = '38fb61d5-dc31-4035-b2ca-43bf1450ab1f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('df9a44da-9c4c-4761-aae0-f0677f188edc', '+201222771416', true, '2026-03-11 02:34:43', '2026-03-11 02:34:43', '38fb61d5-dc31-4035-b2ca-43bf1450ab1f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025120531', "PhoneNumberConfirmed" = true WHERE "Id" = '2b2bd86d-cf62-4d1a-9429-72d0db0907cd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c4ec83a1-433d-42f3-8a30-9e8a40ba6d84', '+201025120531', true, '2025-12-28 22:55:49', '2025-12-28 22:55:49', '2b2bd86d-cf62-4d1a-9429-72d0db0907cd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966532018902', "PhoneNumberConfirmed" = true WHERE "Id" = '1dd819b4-091a-4a6b-a0e0-0cf9336672b9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f103e682-a887-4772-b2c1-427c426fa69a', '+966532018902', true, '2026-06-06 21:20:52', '2026-06-06 21:20:52', '1dd819b4-091a-4a6b-a0e0-0cf9336672b9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201287174055', "PhoneNumberConfirmed" = true WHERE "Id" = '8f7eaac1-5518-46c7-9952-931524b4bfd8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fc5b3976-5b76-4c02-ba13-eb0d5d7f608c', '+201287174055', true, '2026-06-11 11:08:54', '2026-06-11 11:08:54', '8f7eaac1-5518-46c7-9952-931524b4bfd8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201212224621', "PhoneNumberConfirmed" = true WHERE "Id" = 'bc7712af-3b11-4ffc-8432-281beac656e2';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('56abb37d-d9c9-493a-8877-7f2d9f2df217', '+201212224621', true, '2026-06-11 17:28:19', '2026-06-11 17:28:19', 'bc7712af-3b11-4ffc-8432-281beac656e2') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201551304378', "PhoneNumberConfirmed" = true WHERE "Id" = 'b0515b8e-797b-443c-b44a-4f707f87a4fb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8e608014-2794-4b2e-9a21-622e154fdbb2', '+201551304378', true, '2026-06-11 20:25:16', '2026-06-11 20:25:16', 'b0515b8e-797b-443c-b44a-4f707f87a4fb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+212627289841', "PhoneNumberConfirmed" = true WHERE "Id" = '8fd8d07d-68e8-4092-8374-afe9ace678d7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f66d2d11-275b-41d7-b48b-3a477caaa80a', '+212627289841', true, '2026-06-12 17:06:19', '2026-06-12 17:06:19', '8fd8d07d-68e8-4092-8374-afe9ace678d7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098899672', "PhoneNumberConfirmed" = true WHERE "Id" = '1500f131-c0b9-40f4-b5a0-3eb484bcf462';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5d7f9f55-2465-4c95-bb9a-3c3b59b80443', '+201098899672', true, '2025-09-20 15:46:06', '2025-09-20 15:46:06', '1500f131-c0b9-40f4-b5a0-3eb484bcf462') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966573892140', "PhoneNumberConfirmed" = true WHERE "Id" = 'a6abb7b6-548e-4bac-8e71-0aab098ec30b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('eecf0106-9745-4807-9ddd-58db67fdebc3', '+966573892140', true, '2026-05-21 06:39:34', '2026-05-21 06:39:34', 'a6abb7b6-548e-4bac-8e71-0aab098ec30b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+81123456666', "PhoneNumberConfirmed" = true WHERE "Id" = '6f12fe1b-9ba9-47ee-9975-d0f25c835310';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9d9f2cd4-af42-4780-afc4-287310f10d37', '+81123456666', true, '2026-05-17 16:51:39', '2026-05-17 16:51:39', '6f12fe1b-9ba9-47ee-9975-d0f25c835310') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092942545', "PhoneNumberConfirmed" = true WHERE "Id" = '1178a8bc-9407-42ed-9749-a8cad5202eac';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('18cefd67-1fd4-43c8-b62b-20338885e227', '+201092942545', true, '2026-04-29 11:01:02', '2026-04-29 11:01:02', '1178a8bc-9407-42ed-9749-a8cad5202eac') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+971586877552', "PhoneNumberConfirmed" = true WHERE "Id" = '302aaf0e-17e0-4bc4-a035-9db90d432f22';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d4df5188-7546-4360-a2cd-5dd4b8199862', '+971586877552', true, '2026-05-22 23:25:49', '2026-05-22 23:25:49', '302aaf0e-17e0-4bc4-a035-9db90d432f22') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213542654416', "PhoneNumberConfirmed" = true WHERE "Id" = 'df097804-4565-4a29-a902-f9a3b7bc2fa0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('fae63150-471c-4560-bde1-a8b8b7a9ac11', '+213542654416', true, '2026-05-18 20:15:39', '2026-05-18 20:15:39', 'df097804-4565-4a29-a902-f9a3b7bc2fa0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213559509238', "PhoneNumberConfirmed" = true WHERE "Id" = '3f0818fd-2c3f-4f4c-b3a6-f6c933ce2f12';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8396a2b3-badc-4aeb-85cb-808c571524aa', '+213559509238', true, '2026-05-19 04:13:03', '2026-05-19 04:13:03', '3f0818fd-2c3f-4f4c-b3a6-f6c933ce2f12') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201557740252', "PhoneNumberConfirmed" = true WHERE "Id" = 'b3df0ee4-e459-4559-b727-6082d0e8745f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('23288c37-986d-455e-ab01-97d089c028e7', '+201557740252', true, '2026-06-04 20:36:39', '2026-06-04 20:36:39', 'b3df0ee4-e459-4559-b727-6082d0e8745f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201000272324', "PhoneNumberConfirmed" = true WHERE "Id" = '4cd83ae7-4e01-4232-b997-5acd0f0fbfff';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bb4edb19-1458-43c2-8206-7b9a43182a5b', '+201000272324', true, '2026-06-11 22:15:40', '2026-06-11 22:15:40', '4cd83ae7-4e01-4232-b997-5acd0f0fbfff') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+972523914466', "PhoneNumberConfirmed" = true WHERE "Id" = '1d134b9d-8bc6-403c-b638-6504712c0978';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bc8a9086-eebc-4657-b82a-f43382a2a2e2', '+972523914466', true, '2026-05-20 05:00:51', '2026-05-20 05:00:51', '1d134b9d-8bc6-403c-b638-6504712c0978') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022551416', "PhoneNumberConfirmed" = true WHERE "Id" = 'eba429ed-8ab5-4af6-b6d3-d43ba4247705';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('364b9954-aa74-449e-92dc-e486a8f522c9', '+201022551416', true, '2026-05-26 07:52:25', '2026-05-26 07:52:25', 'eba429ed-8ab5-4af6-b6d3-d43ba4247705') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201150305560', "PhoneNumberConfirmed" = true WHERE "Id" = 'eecf005b-dab1-40ff-a1da-46fb70b4dc3e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('58e51e7f-6fde-455e-9b24-281690e2ad15', '+201150305560', true, '2026-06-02 11:38:00', '2026-06-02 11:38:00', 'eecf005b-dab1-40ff-a1da-46fb70b4dc3e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201147781952', "PhoneNumberConfirmed" = true WHERE "Id" = '35a40dac-f407-476d-b7f0-c92923198a24';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dcad304b-cddb-40fc-8ebd-f58b2ef60c04', '+201147781952', true, '2026-06-12 17:10:33', '2026-06-12 17:10:33', '35a40dac-f407-476d-b7f0-c92923198a24') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201212224616', "PhoneNumberConfirmed" = true WHERE "Id" = '12a4d05c-3f0a-4d25-8a05-abc106949dc1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0dc4cb7a-8f19-4b9a-818e-95c6e7960806', '+201212224616', true, '2026-06-11 17:34:40', '2026-06-11 17:34:40', '12a4d05c-3f0a-4d25-8a05-abc106949dc1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201091549900', "PhoneNumberConfirmed" = true WHERE "Id" = '05f74a9f-147c-4b12-945b-c5c9a46870c5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d2393742-e5c9-4aba-b0e1-388b5c56d3ae', '+201091549900', true, '2026-01-13 00:58:56', '2026-01-13 00:58:56', '05f74a9f-147c-4b12-945b-c5c9a46870c5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201208290019', "PhoneNumberConfirmed" = true WHERE "Id" = '5c8b3177-5d35-4040-9334-ea50c57076b4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a8ba77b6-e0b7-40e8-acbd-7179b02b6ff4', '+201208290019', true, '2026-06-14 11:11:24', '2026-06-14 11:11:24', '5c8b3177-5d35-4040-9334-ea50c57076b4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201015250328', "PhoneNumberConfirmed" = true WHERE "Id" = '70ebaf79-1a7a-4cb0-9ad6-7ba1f4b7be86';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('82ff3f98-e958-4024-82a1-84e19b1945e9', '+201015250328', true, '2026-06-21 01:26:56', '2026-06-21 01:26:56', '70ebaf79-1a7a-4cb0-9ad6-7ba1f4b7be86') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201550016313', "PhoneNumberConfirmed" = true WHERE "Id" = '94ace04b-e092-4fd0-8f64-222ad62fd056';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a6d91919-bb17-49e5-88e5-af119a7558d3', '+201550016313', true, '2026-06-11 11:27:43', '2026-06-11 11:27:43', '94ace04b-e092-4fd0-8f64-222ad62fd056') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+218923458526', "PhoneNumberConfirmed" = true WHERE "Id" = '647a93fd-3618-4cf0-b369-2f5b600fbf44';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b39c88fe-8b84-4d14-a97f-b796be8b72a5', '+218923458526', true, '2026-06-23 10:36:20', '2026-06-23 10:36:20', '647a93fd-3618-4cf0-b369-2f5b600fbf44') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213696444128', "PhoneNumberConfirmed" = true WHERE "Id" = '124ba4b4-6c41-485a-b8a3-0f8a4d7ab945';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a8c88c4d-d094-4b8f-bca0-5bd5391de852', '+213696444128', true, '2026-06-23 23:59:04', '2026-06-23 23:59:04', '124ba4b4-6c41-485a-b8a3-0f8a4d7ab945') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201220305077', "PhoneNumberConfirmed" = true WHERE "Id" = '63f7c8d1-030c-46e3-b5a3-c8ec2fadceff';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e84d568a-da0d-45cc-82c1-2419ddce66de', '+201220305077', true, '2026-06-02 12:20:56', '2026-06-02 12:20:56', '63f7c8d1-030c-46e3-b5a3-c8ec2fadceff') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213796334425', "PhoneNumberConfirmed" = true WHERE "Id" = '6d7c4f19-1df0-4922-9e72-ef3051edfd0c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b338e1d3-38ba-4975-968b-18b940242574', '+213796334425', true, '2026-05-17 17:00:14', '2026-05-17 17:00:14', '6d7c4f19-1df0-4922-9e72-ef3051edfd0c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+972599319602', "PhoneNumberConfirmed" = true WHERE "Id" = '13e74d28-8910-4836-afe0-cd3d7f50ef3a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2842f3bd-4939-4dc6-a35b-0ebde282959e', '+972599319602', true, '2026-05-18 11:56:38', '2026-05-18 11:56:38', '13e74d28-8910-4836-afe0-cd3d7f50ef3a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966544084190', "PhoneNumberConfirmed" = true WHERE "Id" = '1fb7b3bf-4df1-4422-b2fc-42bb083c2911';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8fe8cae6-f85a-47f7-9981-6488db320c8f', '+966544084190', true, '2026-05-18 20:42:06', '2026-05-18 20:42:06', '1fb7b3bf-4df1-4422-b2fc-42bb083c2911') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966552663887', "PhoneNumberConfirmed" = true WHERE "Id" = 'a8f3b3ee-94fc-4a29-9daf-7a0ff21406be';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5732ca0a-28ed-487f-bf2b-ed2f378ee32e', '+966552663887', true, '2026-05-19 04:56:12', '2026-05-19 04:56:12', 'a8f3b3ee-94fc-4a29-9daf-7a0ff21406be') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201273858064', "PhoneNumberConfirmed" = true WHERE "Id" = 'b9a06de2-e119-46ef-9763-ee60e5f6165b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ca1878c2-4cd8-476c-9bc7-ead5828d7253', '+201273858064', true, '2026-06-04 17:31:46', '2026-06-04 17:31:46', 'b9a06de2-e119-46ef-9763-ee60e5f6165b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+9647845321787', "PhoneNumberConfirmed" = true WHERE "Id" = 'afd74473-3f31-4cf5-a3c4-0fa015f2bbd3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('44ff2e01-8f2c-4d7d-a8d0-9137dd4e7ce6', '+9647845321787', true, '2026-05-21 08:14:22', '2026-05-21 08:14:22', 'afd74473-3f31-4cf5-a3c4-0fa015f2bbd3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201018012178', "PhoneNumberConfirmed" = true WHERE "Id" = '4711894e-32de-4cd2-9b3f-006e307c6093';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('85b45543-bf56-4fe5-a2f0-0eee6006b1b4', '+201018012178', true, '2026-05-23 01:22:37', '2026-05-23 01:22:37', '4711894e-32de-4cd2-9b3f-006e307c6093') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+14389364481', "PhoneNumberConfirmed" = true WHERE "Id" = '1e4b1458-11af-4b9c-8b80-530484c32a38';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7155697f-21a2-468e-9658-cd76769b7c1c', '+14389364481', true, '2026-05-27 01:02:06', '2026-05-27 01:02:06', '1e4b1458-11af-4b9c-8b80-530484c32a38') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+972592139715', "PhoneNumberConfirmed" = true WHERE "Id" = 'b298462d-1e52-477b-8e3d-aebb771f1ed1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b0c2dc9c-4636-465a-90c8-91a22c04244c', '+972592139715', true, '2026-05-29 13:11:24', '2026-05-29 13:11:24', 'b298462d-1e52-477b-8e3d-aebb771f1ed1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+12397846484', "PhoneNumberConfirmed" = true WHERE "Id" = '5463f31b-7003-443f-8261-0eb7da4d7e09';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('480bcd52-de5c-4adf-8bc6-3a7b99605359', '+12397846484', true, '2026-04-17 23:03:16', '2026-04-17 23:03:16', '5463f31b-7003-443f-8261-0eb7da4d7e09') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+21652336625', "PhoneNumberConfirmed" = true WHERE "Id" = '257df77f-b555-42d1-aa28-7151b321264b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('be6b2aa7-81f5-4cba-8cfb-3c47bf8b6542', '+21652336625', true, '2026-06-07 23:41:24', '2026-06-07 23:41:24', '257df77f-b555-42d1-aa28-7151b321264b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201014566322', "PhoneNumberConfirmed" = true WHERE "Id" = '051462da-fb31-42a2-a9b2-7eb67a9dce1b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c08c9add-e16d-4df7-b85d-9b430782ce70', '+201014566322', true, '2026-06-11 23:02:13', '2026-06-11 23:02:13', '051462da-fb31-42a2-a9b2-7eb67a9dce1b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+97197176897', "PhoneNumberConfirmed" = true WHERE "Id" = '92d48821-369c-41bf-ae96-286e36572f4b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d680acdb-5410-436c-a79f-205b1df412e1', '+97197176897', true, '2026-06-11 12:58:14', '2026-06-11 12:58:14', '92d48821-369c-41bf-ae96-286e36572f4b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201275974671', "PhoneNumberConfirmed" = true WHERE "Id" = '764bfa98-e312-4c7f-b498-33c10ad99a41';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0a947dd8-a400-427b-a73b-6d963d925cc8', '+201275974671', true, '2026-06-11 17:38:31', '2026-06-11 17:38:31', '764bfa98-e312-4c7f-b498-33c10ad99a41') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201093549924', "PhoneNumberConfirmed" = true WHERE "Id" = '96f412f4-d94e-4a65-8d4d-15a4151e2c71';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6d46183c-bff1-4798-a0d9-8a4f7ce4e49c', '+201093549924', true, '2026-06-12 18:20:49', '2026-06-12 18:20:49', '96f412f4-d94e-4a65-8d4d-15a4151e2c71') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201115359551', "PhoneNumberConfirmed" = true WHERE "Id" = '95a60eed-baac-482d-a5df-feab7ab8ef85';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c0e6ebdd-9707-421c-8dec-6f9230e4df27', '+201115359551', true, '2026-06-13 21:20:32', '2026-06-13 21:20:32', '95a60eed-baac-482d-a5df-feab7ab8ef85') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '0104 012 6846', "PhoneNumberConfirmed" = true WHERE "Id" = '4ad6689e-ca67-44d1-a962-7222c159a29e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('df314610-03f3-4f38-b1e2-199a4f96d0d4', '0104 012 6846', true, '2026-03-19 13:26:50', '2026-03-19 13:26:50', '4ad6689e-ca67-44d1-a962-7222c159a29e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002977058', "PhoneNumberConfirmed" = true WHERE "Id" = '4e8e07b6-4a78-48b6-8ee4-3fb4126fc80d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('72e11f4c-42c0-4237-9271-1587e1e38333', '+201002977058', true, '2026-06-17 22:43:28', '2026-06-17 22:43:28', '4e8e07b6-4a78-48b6-8ee4-3fb4126fc80d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966556254209', "PhoneNumberConfirmed" = true WHERE "Id" = '2b3f415d-1dfd-4d7d-a4cb-df0cdb92867c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('00c02d36-0cf9-4af9-b3ad-036b3cd177f4', '+966556254209', true, '2026-06-21 15:13:30', '2026-06-21 15:13:30', '2b3f415d-1dfd-4d7d-a4cb-df0cdb92867c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201029133761', "PhoneNumberConfirmed" = true WHERE "Id" = '955d027d-240e-4762-bb48-bec79ab5e141';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7d91477b-9563-45fb-b593-a2ab78d8bfce', '+201029133761', true, '2026-06-23 11:49:47', '2026-06-23 11:49:47', '955d027d-240e-4762-bb48-bec79ab5e141') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213784481224', "PhoneNumberConfirmed" = true WHERE "Id" = '14784fa0-348b-47b9-9388-336cddc9a6b5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('587aa6a0-4581-4d3d-b54c-049f5a171731', '+213784481224', true, '2026-05-17 22:53:10', '2026-05-17 22:53:10', '14784fa0-348b-47b9-9388-336cddc9a6b5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090679696', "PhoneNumberConfirmed" = true WHERE "Id" = '8ba79c79-52c6-441c-a2aa-c6555c54dfbd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bc2ea36e-1ee8-4423-a219-059992c5b82f', '+201090679696', true, '2026-05-01 02:59:05', '2026-05-01 02:59:05', '8ba79c79-52c6-441c-a2aa-c6555c54dfbd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+971585777878', "PhoneNumberConfirmed" = true WHERE "Id" = '79599870-e33d-49f2-955a-3caa70626159';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('af9d7f87-c5a2-4c33-9bf2-26d738e91742', '+971585777878', true, '2026-05-18 13:15:37', '2026-05-18 13:15:37', '79599870-e33d-49f2-955a-3caa70626159') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966545418974', "PhoneNumberConfirmed" = true WHERE "Id" = '08887e84-2e6c-4ac5-aafc-086897336b53';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a9fa3ef7-acfa-42ef-b201-f09d80a46c8c', '+966545418974', true, '2026-06-02 15:54:38', '2026-06-02 15:54:38', '08887e84-2e6c-4ac5-aafc-086897336b53') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966542180200', "PhoneNumberConfirmed" = true WHERE "Id" = '0c44b366-af7b-4778-9ee7-55ec92d57eef';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('92e12435-4fca-4067-8be7-ffc8fa947b35', '+966542180200', true, '2026-05-19 08:50:53', '2026-05-19 08:50:53', '0c44b366-af7b-4778-9ee7-55ec92d57eef') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201287525130', "PhoneNumberConfirmed" = true WHERE "Id" = '55c1ecd5-f27b-4c62-9fd0-c6d7cf69165d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('41a1da6a-9108-4325-869f-847beca5f9e2', '+201287525130', true, '2026-06-11 12:13:33', '2026-06-11 12:13:33', '55c1ecd5-f27b-4c62-9fd0-c6d7cf69165d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+9647822163172', "PhoneNumberConfirmed" = true WHERE "Id" = 'f7309a26-1d18-47d6-9548-efee146c5191';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('cf89e05e-5f5a-486e-803b-051e079429d7', '+9647822163172', true, '2026-05-20 07:29:00', '2026-05-20 07:29:00', 'f7309a26-1d18-47d6-9548-efee146c5191') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030436419', "PhoneNumberConfirmed" = true WHERE "Id" = '4fd8f07c-4896-4f57-9731-25184548cc16';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f9d524f4-1b5d-4a67-a014-7432dcb0e96b', '+201030436419', true, '2026-05-27 03:28:46', '2026-05-27 03:28:46', '4fd8f07c-4896-4f57-9731-25184548cc16') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201080053726', "PhoneNumberConfirmed" = true WHERE "Id" = 'e288b4e2-4caf-4457-8e44-d151a96ac396';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('59e387b3-4a76-4073-9fd2-0a4c121f9fa0', '+201080053726', true, '2026-05-21 10:32:30', '2026-05-21 10:32:30', 'e288b4e2-4caf-4457-8e44-d151a96ac396') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201159486062', "PhoneNumberConfirmed" = true WHERE "Id" = '269cdb5b-1f19-4d44-a28b-42468faf1062';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('aa4f0f7c-667b-4ed0-b34f-2ef11cb3a8ac', '+201159486062', true, '2026-04-14 17:43:31', '2026-04-14 17:43:31', '269cdb5b-1f19-4d44-a28b-42468faf1062') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201208816154', "PhoneNumberConfirmed" = true WHERE "Id" = 'ada00798-3d65-465e-9aad-c602478186e7';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e640f82c-7eac-4a32-bdfe-7176369548e5', '+201208816154', true, '2026-04-29 18:48:56', '2026-04-29 18:48:56', 'ada00798-3d65-465e-9aad-c602478186e7') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966549926691', "PhoneNumberConfirmed" = true WHERE "Id" = '0f62092b-8afb-4809-9192-4f2b7b1076a4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('23cb6c9c-b440-48ea-93a9-13d34491d5ee', '+966549926691', true, '2026-06-04 23:33:29', '2026-06-04 23:33:29', '0f62092b-8afb-4809-9192-4f2b7b1076a4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201092652777', "PhoneNumberConfirmed" = true WHERE "Id" = '7f9685de-6118-42b1-b1b4-5b9ca0301afd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('37995c67-fcc4-4b85-93dd-a5b26270409a', '+201092652777', true, '2026-04-13 19:55:30', '2026-04-13 19:55:30', '7f9685de-6118-42b1-b1b4-5b9ca0301afd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201111309250', "PhoneNumberConfirmed" = true WHERE "Id" = '20d093d3-67f4-4393-9986-9a913c0b09a6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('90fc37a2-ebc2-41e4-845c-f691124a3e3e', '+201111309250', true, '2026-06-12 01:03:20', '2026-06-12 01:03:20', '20d093d3-67f4-4393-9986-9a913c0b09a6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201024825342', "PhoneNumberConfirmed" = true WHERE "Id" = '08d22e68-554d-446c-b6bf-d4fc683683b3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e5795925-b48a-4d60-916d-949f31399fb1', '+201024825342', true, '2026-06-14 15:47:12', '2026-06-14 15:47:12', '08d22e68-554d-446c-b6bf-d4fc683683b3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201210114497', "PhoneNumberConfirmed" = true WHERE "Id" = 'c2ff6de4-542a-4ac5-a9d1-fa44b89d5f12';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('17fce3dc-103f-41b9-bb38-2468a4cff548', '+201210114497', true, '2026-06-14 00:58:39', '2026-06-14 00:58:39', 'c2ff6de4-542a-4ac5-a9d1-fa44b89d5f12') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+996565613513', "PhoneNumberConfirmed" = true WHERE "Id" = '61515777-c36e-4560-b69f-e192f939c4cb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f2e7d767-a571-4e0b-abcd-37cf423e5e87', '+996565613513', true, '2026-06-17 23:05:56', '2026-06-17 23:05:56', '61515777-c36e-4560-b69f-e192f939c4cb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+212652377208', "PhoneNumberConfirmed" = true WHERE "Id" = '0ddf584b-2457-4992-94c4-8fc91f3da87c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e909a13e-1b9e-4935-8bf1-a5b5ea163f19', '+212652377208', true, '2026-05-18 21:22:53', '2026-05-18 21:22:53', '0ddf584b-2457-4992-94c4-8fc91f3da87c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+996502625228', "PhoneNumberConfirmed" = true WHERE "Id" = '134dc71e-74e6-4706-8bf0-498db47b3879';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e22c15a7-7dd1-4d21-833c-0b118c5c6aa1', '+996502625228', true, '2026-06-02 19:35:05', '2026-06-02 19:35:05', '134dc71e-74e6-4706-8bf0-498db47b3879') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201120587071', "PhoneNumberConfirmed" = true WHERE "Id" = '9fef6136-2f83-4a98-9193-d59f0f5bb307';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ef7561d7-bd66-420c-b1bb-5094bff18848', '+201120587071', true, '2026-06-12 18:27:59', '2026-06-12 18:27:59', '9fef6136-2f83-4a98-9193-d59f0f5bb307') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201063099660', "PhoneNumberConfirmed" = true WHERE "Id" = 'e762870a-74d2-4e06-966a-58a0ab132656';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('21d708a2-bb46-4232-8701-dd1a1103fe39', '+201063099660', true, '2026-04-14 19:37:29', '2026-04-14 19:37:29', 'e762870a-74d2-4e06-966a-58a0ab132656') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201112984929', "PhoneNumberConfirmed" = true WHERE "Id" = '198332f2-460e-479b-b4a6-cadad37d53e6';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('14cb8cf4-b0ad-49e1-9d9d-ff3bf64f137e', '+201112984929', true, '2026-02-08 20:23:58', '2026-02-08 20:23:58', '198332f2-460e-479b-b4a6-cadad37d53e6') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+13232365869', "PhoneNumberConfirmed" = true WHERE "Id" = 'e7083f84-7117-4e58-b676-d5f6bc53fd7b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7dbcb555-10b9-4e86-8f21-7aaaa3f8d8b6', '+13232365869', true, '2026-05-17 17:34:48', '2026-05-17 17:34:48', 'e7083f84-7117-4e58-b676-d5f6bc53fd7b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201062335619', "PhoneNumberConfirmed" = true WHERE "Id" = 'dc6c4b8f-83f3-4a62-93f6-8559e85ef247';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d27a78f0-8eb5-4170-94bb-9e566a94c131', '+201062335619', true, '2026-04-19 16:13:50', '2026-04-19 16:13:50', 'dc6c4b8f-83f3-4a62-93f6-8559e85ef247') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201270929540', "PhoneNumberConfirmed" = true WHERE "Id" = '2075b1d4-a2bf-43d2-bc73-704d426fe388';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3e0b1079-5b4f-4981-a47b-09eeecc8bb7e', '+201270929540', true, '2026-05-18 21:29:48', '2026-05-18 21:29:48', '2075b1d4-a2bf-43d2-bc73-704d426fe388') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201200913399', "PhoneNumberConfirmed" = true WHERE "Id" = 'c210dfee-13e2-4553-a7c4-eaac4aa7679c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7d855aac-e628-4d76-9f89-ea688dec891f', '+201200913399', true, '2026-04-19 18:12:24', '2026-04-19 18:12:24', 'c210dfee-13e2-4553-a7c4-eaac4aa7679c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002851291', "PhoneNumberConfirmed" = true WHERE "Id" = 'bba85593-b007-4137-b6d7-8d4c3ec43a0e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('bec56d2b-adb6-452e-90dd-b3c83c9268c2', '+201002851291', true, '2026-05-19 11:10:41', '2026-05-19 11:10:41', 'bba85593-b007-4137-b6d7-8d4c3ec43a0e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+972529358932', "PhoneNumberConfirmed" = true WHERE "Id" = '96fc860a-22c7-4b6e-88df-2c9a0354854d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('347f3a2c-5a9f-48c2-8e4a-2c04718f1d96', '+972529358932', true, '2026-05-20 11:07:08', '2026-05-20 11:07:08', '96fc860a-22c7-4b6e-88df-2c9a0354854d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+996774635411', "PhoneNumberConfirmed" = true WHERE "Id" = '6f1bf4fd-b4be-4c33-bdfd-4d199292e6c3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b6d0e299-c6f1-41f0-bc86-e952314d877b', '+996774635411', true, '2026-05-23 23:56:28', '2026-05-23 23:56:28', '6f1bf4fd-b4be-4c33-bdfd-4d199292e6c3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030436418', "PhoneNumberConfirmed" = true WHERE "Id" = '41550fc5-ab23-426e-bb4f-da8fc3bd2dd9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ccd50383-19b1-4d63-a9c6-f2461c988bd3', '+201030436418', true, '2026-05-27 06:18:54', '2026-05-27 06:18:54', '41550fc5-ab23-426e-bb4f-da8fc3bd2dd9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966544037902', "PhoneNumberConfirmed" = true WHERE "Id" = '9d8870ca-d38e-4c3d-9e46-99970e54f558';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ca3757ac-1912-4f5d-b9bc-28688f6c2d5f', '+966544037902', true, '2026-05-29 22:34:51', '2026-05-29 22:34:51', '9d8870ca-d38e-4c3d-9e46-99970e54f558') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201277030704', "PhoneNumberConfirmed" = true WHERE "Id" = '7377252b-8f1d-42fd-94e6-fc86b1e232d3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('eb7762fa-bd2f-4345-b87c-6478d050041c', '+201277030704', true, '2026-04-29 18:51:27', '2026-04-29 18:51:27', '7377252b-8f1d-42fd-94e6-fc86b1e232d3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966578923353', "PhoneNumberConfirmed" = true WHERE "Id" = '256bf274-4957-4ba2-a37f-24424dd296cf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f39bfe1e-5d42-4b5c-b8a6-8f04817a5593', '+966578923353', true, '2026-06-08 16:08:45', '2026-06-08 16:08:45', '256bf274-4957-4ba2-a37f-24424dd296cf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201022988448', "PhoneNumberConfirmed" = true WHERE "Id" = '9555bb34-5825-4980-8ff0-138bb33f0f86';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('39785458-ab09-4273-a03d-fcbfe18c946f', '+201022988448', true, '2026-06-11 17:43:18', '2026-06-11 17:43:18', '9555bb34-5825-4980-8ff0-138bb33f0f86') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201027268223', "PhoneNumberConfirmed" = true WHERE "Id" = '338475a6-2d80-4011-8768-c6e62c5e3a80';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3d018aa0-3f1b-4ef5-ab27-e2be8e4cd86a', '+201027268223', true, '2026-06-12 11:43:43', '2026-06-12 11:43:43', '338475a6-2d80-4011-8768-c6e62c5e3a80') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966500467467', "PhoneNumberConfirmed" = true WHERE "Id" = 'ab3d5d87-57c2-437a-92dc-baee8a755cbf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('91a894ed-2b68-4b25-8a61-ed43fecf5457', '+966500467467', true, '2026-06-14 03:39:15', '2026-06-14 03:39:15', 'ab3d5d87-57c2-437a-92dc-baee8a755cbf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201007848324', "PhoneNumberConfirmed" = true WHERE "Id" = '5da24b36-ec75-4df8-91e7-eb26b752e165';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('5dcdb241-5988-49fe-89be-1276d306edb6', '+201007848324', true, '2026-06-14 20:15:21', '2026-06-14 20:15:21', '5da24b36-ec75-4df8-91e7-eb26b752e165') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+972599476692', "PhoneNumberConfirmed" = true WHERE "Id" = '2f8f110a-1c72-4aca-b99c-ef1ff7ad408b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('404ec2f4-9e53-4b3c-a42f-d521027b65af', '+972599476692', true, '2026-06-22 20:44:50', '2026-06-22 20:44:50', '2f8f110a-1c72-4aca-b99c-ef1ff7ad408b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201009712019', "PhoneNumberConfirmed" = true WHERE "Id" = '0b90601b-7d2b-4a4a-8659-252a8d0b11be';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('50ac893c-d5e0-4f0b-b20c-f980b5ccc3be', '+201009712019', true, '2026-02-06 12:16:36', '2026-02-06 12:16:36', '0b90601b-7d2b-4a4a-8659-252a8d0b11be') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201148944115', "PhoneNumberConfirmed" = true WHERE "Id" = '003f97e3-1120-4447-bf9a-e5c218cfc9a1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d8582de2-bbc1-4cab-979d-9664927bf196', '+201148944115', true, '2026-05-01 20:12:09', '2026-05-01 20:12:09', '003f97e3-1120-4447-bf9a-e5c218cfc9a1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201024005675', "PhoneNumberConfirmed" = true WHERE "Id" = '5eeb9658-0b8d-4c56-8241-18c6b8712f83';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6cb2abe5-27e2-44ba-aaf0-082d07f45b3f', '+201024005675', true, '2026-02-15 19:47:59', '2026-02-15 19:47:59', '5eeb9658-0b8d-4c56-8241-18c6b8712f83') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+212658206994', "PhoneNumberConfirmed" = true WHERE "Id" = '2456f7f3-1f33-479f-a11b-72479795631b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4cc1824b-6044-4a23-a368-9f5c14fa44ce', '+212658206994', true, '2026-05-17 17:55:23', '2026-05-17 17:55:23', '2456f7f3-1f33-479f-a11b-72479795631b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213673403556', "PhoneNumberConfirmed" = true WHERE "Id" = 'bd2ecc3d-096f-4b7d-a044-5c6fed01b51b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d36a2f8d-6207-4f4d-b605-6065ca5a64fc', '+213673403556', true, '2026-05-24 02:21:59', '2026-05-24 02:21:59', 'bd2ecc3d-096f-4b7d-a044-5c6fed01b51b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201280093424', "PhoneNumberConfirmed" = true WHERE "Id" = '30f9adc3-d0f5-47b8-87d8-eaa588b6f971';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('12481f1c-f4fd-4fe1-a647-c91189b2ce74', '+201280093424', true, '2026-04-14 21:21:47', '2026-04-14 21:21:47', '30f9adc3-d0f5-47b8-87d8-eaa588b6f971') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201017355422', "PhoneNumberConfirmed" = true WHERE "Id" = '1c725e5c-4a32-4119-9a39-0984c5034c7d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7e803300-7965-4487-a51d-44a967615e03', '+201017355422', true, '2026-04-13 07:03:10', '2026-04-13 07:03:10', '1c725e5c-4a32-4119-9a39-0984c5034c7d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050449294', "PhoneNumberConfirmed" = true WHERE "Id" = 'f7eb6390-8d95-439c-82e5-bc547129c2fe';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('01ef3512-f052-479e-be5d-ebbac654ed78', '+201050449294', true, '2026-06-02 20:59:46', '2026-06-02 20:59:46', 'f7eb6390-8d95-439c-82e5-bc547129c2fe') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030456419', "PhoneNumberConfirmed" = true WHERE "Id" = 'b50e1679-890d-4063-857c-2d86e8bd61de';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c56a252c-eace-462b-bef7-bfef21f0e570', '+201030456419', true, '2026-05-27 06:27:56', '2026-05-27 06:27:56', 'b50e1679-890d-4063-857c-2d86e8bd61de') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201277947733', "PhoneNumberConfirmed" = true WHERE "Id" = '9d25d055-2b17-458f-9f6e-e4728eeed0a5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ebf60933-0445-4b97-99a5-2c4ece482169', '+201277947733', true, '2026-01-12 21:44:32', '2026-01-12 21:44:32', '9d25d055-2b17-458f-9f6e-e4728eeed0a5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201212252379', "PhoneNumberConfirmed" = true WHERE "Id" = 'c6fc887d-6b59-4f05-8d65-c591289be1eb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('78cfa7fa-7001-4614-aeb1-3fdec02ce5fd', '+201212252379', true, '2026-01-10 16:35:47', '2026-01-10 16:35:47', 'c6fc887d-6b59-4f05-8d65-c591289be1eb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201098808878', "PhoneNumberConfirmed" = true WHERE "Id" = 'd1840324-8335-4940-a578-af652277140d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('937420e2-8093-4b01-af6a-6a7330db7e7d', '+201098808878', true, '2026-05-10 04:38:53', '2026-05-10 04:38:53', 'd1840324-8335-4940-a578-af652277140d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201005259459', "PhoneNumberConfirmed" = true WHERE "Id" = '539c745e-f4e5-4183-a3b9-b780fb6ebffa';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('62dee5e6-616e-4b28-ab4a-d27a2aa273d6', '+201005259459', true, '2026-06-12 13:24:37', '2026-06-12 13:24:37', '539c745e-f4e5-4183-a3b9-b780fb6ebffa') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201005036750', "PhoneNumberConfirmed" = true WHERE "Id" = '07932ef5-ddce-4292-b469-76012e89949e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e753cf20-7514-48aa-9a11-28db3247c414', '+201005036750', true, '2026-04-07 01:38:28', '2026-04-07 01:38:28', '07932ef5-ddce-4292-b469-76012e89949e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201205103311', "PhoneNumberConfirmed" = true WHERE "Id" = '3fc8ec2a-d6d8-4dec-87e5-a9a573621d24';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('248839c0-c3e6-4628-92ed-3bf3277b6347', '+201205103311', true, '2026-06-11 13:29:54', '2026-06-11 13:29:54', '3fc8ec2a-d6d8-4dec-87e5-a9a573621d24') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201104280712', "PhoneNumberConfirmed" = true WHERE "Id" = '175c5412-acb6-432f-9a1b-52705db5129f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('af96e8b7-5fa8-49f4-88b4-e8ad2458c192', '+201104280712', true, '2026-06-12 18:57:59', '2026-06-12 18:57:59', '175c5412-acb6-432f-9a1b-52705db5129f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201150651716', "PhoneNumberConfirmed" = true WHERE "Id" = '78ff222b-a12a-4734-b8aa-073244242990';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b279612a-d337-45bd-9b70-004363e8ee10', '+201150651716', true, '2026-06-14 20:55:27', '2026-06-14 20:55:27', '78ff222b-a12a-4734-b8aa-073244242990') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201201303141', "PhoneNumberConfirmed" = true WHERE "Id" = 'f277fda6-9f05-456c-8d3e-389852c4c478';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3069f25b-1055-4c92-8588-4e086a8f05f7', '+201201303141', true, '2026-04-28 20:45:28', '2026-04-28 20:45:28', 'f277fda6-9f05-456c-8d3e-389852c4c478') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201111368143', "PhoneNumberConfirmed" = true WHERE "Id" = 'cd5961af-031e-48c2-b2a5-e64f31cc89e9';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('042a38f2-c6fd-424d-9910-34a884d1adb7', '+201111368143', true, '2026-04-24 16:43:14', '2026-04-24 16:43:14', 'cd5961af-031e-48c2-b2a5-e64f31cc89e9') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+212659828918', "PhoneNumberConfirmed" = true WHERE "Id" = '90803407-0af3-41c9-877c-ad49e00562bf';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dc7c3ed6-684a-498c-b56b-384d86822218', '+212659828918', true, '2026-05-17 18:02:56', '2026-05-17 18:02:56', '90803407-0af3-41c9-877c-ad49e00562bf') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+212665356899', "PhoneNumberConfirmed" = true WHERE "Id" = '2e2c51a6-6b57-4d8f-927b-a5426a325b01';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('651b3bb1-0ce9-4767-8958-bfe75d9259bf', '+212665356899', true, '2026-05-18 00:05:22', '2026-05-18 00:05:22', '2e2c51a6-6b57-4d8f-927b-a5426a325b01') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201025610695', "PhoneNumberConfirmed" = true WHERE "Id" = 'c2a9d837-ae27-43fe-bde0-4017d00d2cfd';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6e2db78d-9a41-4d63-af28-d5105fb4080a', '+201025610695', true, '2026-04-29 12:23:25', '2026-04-29 12:23:25', 'c2a9d837-ae27-43fe-bde0-4017d00d2cfd') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966540591292', "PhoneNumberConfirmed" = true WHERE "Id" = '5b736cc8-6f29-4e49-a5e1-4622d28e5291';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('74202cf5-80b9-4955-b212-bb74443780f0', '+966540591292', true, '2026-05-18 15:22:21', '2026-05-18 15:22:21', '5b736cc8-6f29-4e49-a5e1-4622d28e5291') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213781468124', "PhoneNumberConfirmed" = true WHERE "Id" = '610244fe-a5a2-4d04-bb58-13f8354e53ed';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f32a5664-37ce-4756-a2ce-7beef0066e7b', '+213781468124', true, '2026-05-18 22:16:44', '2026-05-18 22:16:44', '610244fe-a5a2-4d04-bb58-13f8354e53ed') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201099087503', "PhoneNumberConfirmed" = true WHERE "Id" = '7d83dc09-6767-4e84-99de-8c44a363126a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e7ae81a6-1daa-4c8f-a63e-b87bdaa2acbf', '+201099087503', true, '2026-05-19 16:34:36', '2026-05-19 16:34:36', '7d83dc09-6767-4e84-99de-8c44a363126a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966567416270', "PhoneNumberConfirmed" = true WHERE "Id" = 'a0fcb50a-8c0d-414d-a560-04b7482cd8b8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9951171b-1d8a-4a6c-bd13-3e77e9809dbb', '+966567416270', true, '2026-05-21 21:35:42', '2026-05-21 21:35:42', 'a0fcb50a-8c0d-414d-a560-04b7482cd8b8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201100000000', "PhoneNumberConfirmed" = true WHERE "Id" = 'f9607380-7342-4dbb-b915-7bd2db166d2a';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('818a9358-ec44-415a-9642-97396edaa664', '+201100000000', true, '2026-04-29 07:14:35', '2026-04-29 07:14:35', 'f9607380-7342-4dbb-b915-7bd2db166d2a') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201018690120', "PhoneNumberConfirmed" = true WHERE "Id" = '16d29614-fcc0-43e0-a371-1289ed7728a8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e556c744-65ef-4cc5-b72d-af72eb4fa680', '+201018690120', true, '2026-01-16 10:02:31', '2026-01-16 10:02:31', '16d29614-fcc0-43e0-a371-1289ed7728a8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201021494923', "PhoneNumberConfirmed" = true WHERE "Id" = 'a2a9901f-fdc2-4a99-aa12-82c5e20feb24';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8b415952-f9a5-4b79-bbdf-cd88df0a9e8d', '+201021494923', true, '2026-04-30 15:53:05', '2026-04-30 15:53:05', 'a2a9901f-fdc2-4a99-aa12-82c5e20feb24') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201555963657', "PhoneNumberConfirmed" = true WHERE "Id" = '93d67090-c97f-48a9-b915-25b7dd1930ec';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b152608d-3675-4cd0-98d8-095365dcf053', '+201555963657', true, '2025-10-02 09:22:51', '2025-10-02 09:22:51', '93d67090-c97f-48a9-b915-25b7dd1930ec') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201287282002', "PhoneNumberConfirmed" = true WHERE "Id" = '5a23a4e7-ce8e-4877-af35-ed9f66db8763';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0970a3c9-b761-4aa2-8c48-cad2ab1d2c5b', '+201287282002', true, '2026-02-04 12:21:14', '2026-02-04 12:21:14', '5a23a4e7-ce8e-4877-af35-ed9f66db8763') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201002619515', "PhoneNumberConfirmed" = true WHERE "Id" = '855b661d-ed37-4ea5-93e0-9fd00746a497';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2f9e30f5-edb1-449d-ad07-739d479cc037', '+201002619515', true, '2026-05-27 22:01:13', '2026-05-27 22:01:13', '855b661d-ed37-4ea5-93e0-9fd00746a497') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966506572263', "PhoneNumberConfirmed" = true WHERE "Id" = 'eaa0a979-04f8-4574-8b3f-44ac4fffbdc1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b30fb242-326e-4ef3-a55b-dc170ad06a99', '+966506572263', true, '2026-06-10 18:43:01', '2026-06-10 18:43:01', 'eaa0a979-04f8-4574-8b3f-44ac4fffbdc1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201265324785', "PhoneNumberConfirmed" = true WHERE "Id" = '50c0f920-0116-425d-979f-abdf4c3ca558';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('13777267-cc19-4c42-b20e-ee5c4746dbd1', '+201265324785', true, '2026-05-30 21:36:43', '2026-05-30 21:36:43', '50c0f920-0116-425d-979f-abdf4c3ca558') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+37495792724', "PhoneNumberConfirmed" = true WHERE "Id" = 'fc2ee7e9-21bd-437c-8305-1e60ef7c2720';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('03620c8e-48c3-4009-832f-3554753367b7', '+37495792724', true, '2026-06-12 12:48:01', '2026-06-12 12:48:01', 'fc2ee7e9-21bd-437c-8305-1e60ef7c2720') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201062282857', "PhoneNumberConfirmed" = true WHERE "Id" = '8a8f545e-6e81-4489-b8c9-3c6d072eb21b';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('48b75ef5-ed14-46f9-83a3-492b56d45c6a', '+201062282857', true, '2026-06-11 15:38:39', '2026-06-11 15:38:39', '8a8f545e-6e81-4489-b8c9-3c6d072eb21b') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090193738', "PhoneNumberConfirmed" = true WHERE "Id" = '60d7ee3e-eeaa-4f31-81a5-77ad970aaefc';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a459aebe-57c4-4514-81ee-fbd345b9955b', '+201090193738', true, '2026-06-11 18:10:56', '2026-06-11 18:10:56', '60d7ee3e-eeaa-4f31-81a5-77ad970aaefc') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213661482857', "PhoneNumberConfirmed" = true WHERE "Id" = 'ddbea0f6-a7a1-44ed-904e-62795ceae68f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('f5c4be9c-59ef-4c33-9f88-4102f54033df', '+213661482857', true, '2026-05-24 18:49:51', '2026-05-24 18:49:51', 'ddbea0f6-a7a1-44ed-904e-62795ceae68f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966573420125', "PhoneNumberConfirmed" = true WHERE "Id" = '05380219-9266-4ed8-ba0b-7458b4a2ec2f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6aa10662-1714-42e7-8bf7-0eca59255f80', '+966573420125', true, '2026-06-06 04:18:46', '2026-06-06 04:18:46', '05380219-9266-4ed8-ba0b-7458b4a2ec2f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966570277783', "PhoneNumberConfirmed" = true WHERE "Id" = '16cf09f7-e792-484c-869a-694150bc17b3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6f7c1eda-ad35-4c30-9c8f-3e4de8b6707f', '+966570277783', true, '2026-05-17 18:03:46', '2026-05-17 18:03:46', '16cf09f7-e792-484c-869a-694150bc17b3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+17019976600', "PhoneNumberConfirmed" = true WHERE "Id" = '5056b1e1-79a5-4f27-b1af-888661496a65';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('df85f857-da61-42fd-99fa-58c778e01b94', '+17019976600', true, '2026-04-21 20:21:09', '2026-04-21 20:21:09', '5056b1e1-79a5-4f27-b1af-888661496a65') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966590800355', "PhoneNumberConfirmed" = true WHERE "Id" = '82feb336-7ef7-4ea9-bf25-c7cd781c4d38';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('4cf4f40b-e62d-41d5-a30e-fd4a05509aa8', '+966590800355', true, '2026-05-28 09:38:00', '2026-05-28 09:38:00', '82feb336-7ef7-4ea9-bf25-c7cd781c4d38') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966508214133', "PhoneNumberConfirmed" = true WHERE "Id" = '0003100e-4c2f-4441-9fe1-a9b1c94a22fa';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('59d8f1c8-4d13-4556-8c3b-5f5c29c01cf5', '+966508214133', true, '2026-05-18 00:28:33', '2026-05-18 00:28:33', '0003100e-4c2f-4441-9fe1-a9b1c94a22fa') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201228633843', "PhoneNumberConfirmed" = true WHERE "Id" = 'd6c064f2-26dd-4eb7-a24b-89451098352f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('6250c586-cafa-4285-99e3-cbef5bb332ba', '+201228633843', true, '2026-04-30 04:54:22', '2026-04-30 04:54:22', 'd6c064f2-26dd-4eb7-a24b-89451098352f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966550007726', "PhoneNumberConfirmed" = true WHERE "Id" = 'f1a74d40-6cbd-4655-bb7c-83b077dc8deb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('dd134c93-036b-4edb-82f4-b0c9b610f896', '+966550007726', true, '2026-05-19 18:57:26', '2026-05-19 18:57:26', 'f1a74d40-6cbd-4655-bb7c-83b077dc8deb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201050607076', "PhoneNumberConfirmed" = true WHERE "Id" = '4331d5ab-3a3c-422d-8987-a2a576d616e1';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('aaccffcf-4f86-411b-adc9-4e9cb38d2f55', '+201050607076', true, '2026-02-20 02:56:47', '2026-02-20 02:56:47', '4331d5ab-3a3c-422d-8987-a2a576d616e1') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966539392623', "PhoneNumberConfirmed" = true WHERE "Id" = '227ef612-937c-480c-9df5-90c7f28c3b8d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('7143f0df-d8f3-4fe2-a92d-ed7e0f09e38c', '+966539392623', true, '2026-05-21 23:51:53', '2026-05-21 23:51:53', '227ef612-937c-480c-9df5-90c7f28c3b8d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201207600868', "PhoneNumberConfirmed" = true WHERE "Id" = 'c9dd2279-e190-4caf-9b71-bb2690705f9d';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('02533a98-6952-4044-a30b-63ec2b407ea0', '+201207600868', true, '2026-06-12 13:02:17', '2026-06-12 13:02:17', 'c9dd2279-e190-4caf-9b71-bb2690705f9d') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '01094234394', "PhoneNumberConfirmed" = true WHERE "Id" = '57c9e08c-f561-40b0-8df0-d25510ff6df5';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('925971a4-5bd5-4117-8fa8-9881ad8b638f', '01094234394', true, '2025-12-15 14:08:38', '2025-12-15 14:08:38', '57c9e08c-f561-40b0-8df0-d25510ff6df5') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201093321013', "PhoneNumberConfirmed" = true WHERE "Id" = '6aa2fc89-2e6e-4c7f-b2b3-05949afc0a82';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('265a4d06-ac74-4a30-8016-bbb63481e670', '+201093321013', true, '2026-06-10 22:30:00', '2026-06-10 22:30:00', '6aa2fc89-2e6e-4c7f-b2b3-05949afc0a82') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201204348150', "PhoneNumberConfirmed" = true WHERE "Id" = '499931d9-9169-4ccb-ad4e-6a4a86a8e5be';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('c26cb4f3-9701-43b2-b7b5-cd95f4f5ef7d', '+201204348150', true, '2026-06-02 23:05:38', '2026-06-02 23:05:38', '499931d9-9169-4ccb-ad4e-6a4a86a8e5be') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201108124767', "PhoneNumberConfirmed" = true WHERE "Id" = '5c04e956-fda0-48b0-a8ad-894b0517dc28';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('3cad1ac4-5c13-4f9f-9574-d9e27695f4b2', '+201108124767', true, '2026-06-13 05:10:13', '2026-06-13 05:10:13', '5c04e956-fda0-48b0-a8ad-894b0517dc28') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201090331253', "PhoneNumberConfirmed" = true WHERE "Id" = '262d71f3-ebe2-4b5d-a44a-d0fa3494d4da';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1c1ecaff-1c17-46e8-943c-ea070e6146a0', '+201090331253', true, '2026-06-11 16:47:56', '2026-06-11 16:47:56', '262d71f3-ebe2-4b5d-a44a-d0fa3494d4da') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201065197482', "PhoneNumberConfirmed" = true WHERE "Id" = '7a3da9f9-c405-47cf-8fc6-75419ec99c64';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('ab570104-5f97-4dbe-9dd2-b118870e23a9', '+201065197482', true, '2026-06-14 08:59:28', '2026-06-14 08:59:28', '7a3da9f9-c405-47cf-8fc6-75419ec99c64') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201007819376', "PhoneNumberConfirmed" = true WHERE "Id" = '353e0f2b-0ba9-4e06-b3d8-124a9088c4c0';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('83d29be4-38cf-49f2-807c-0b2580525464', '+201007819376', true, '2026-06-16 21:11:57', '2026-06-16 21:11:57', '353e0f2b-0ba9-4e06-b3d8-124a9088c4c0') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+996559319648', "PhoneNumberConfirmed" = true WHERE "Id" = '00417643-a4be-404d-88ea-5b9f677de4de';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a75cee38-0d37-4147-913f-2fa3f25a8f61', '+996559319648', true, '2026-05-17 18:09:51', '2026-05-17 18:09:51', '00417643-a4be-404d-88ea-5b9f677de4de') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201553399397', "PhoneNumberConfirmed" = true WHERE "Id" = '863c6cd9-f2d4-4acb-94d0-2b196cf9c454';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('1c8386f3-bab6-4175-b999-c6ea8f56e969', '+201553399397', true, '2026-05-02 19:56:27', '2026-05-02 19:56:27', '863c6cd9-f2d4-4acb-94d0-2b196cf9c454') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201145823437', "PhoneNumberConfirmed" = true WHERE "Id" = 'a4b2fc28-53ad-45a6-8e03-8fd00105b807';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('2534a048-8417-4813-8fa0-384ddf68efd5', '+201145823437', true, '2026-05-18 22:25:23', '2026-05-18 22:25:23', 'a4b2fc28-53ad-45a6-8e03-8fd00105b807') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201115465372', "PhoneNumberConfirmed" = true WHERE "Id" = 'c9a19297-a381-40b0-b311-4898b675c018';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('8123522e-c322-4aab-905a-d5b4cff9e475', '+201115465372', true, '2026-04-22 19:11:45', '2026-04-22 19:11:45', 'c9a19297-a381-40b0-b311-4898b675c018') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+213795306594', "PhoneNumberConfirmed" = true WHERE "Id" = '2ec8c33b-5600-487c-b523-283153f9f853';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9ce9dd6c-8215-43e6-902a-9517e0f3aec0', '+213795306594', true, '2026-05-25 03:38:31', '2026-05-25 03:38:31', '2ec8c33b-5600-487c-b523-283153f9f853') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201288838769', "PhoneNumberConfirmed" = true WHERE "Id" = '0f92ab15-a76c-4715-aa77-fcf180658976';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('57ccab91-5479-4bcc-904d-ffad85878d5e', '+201288838769', true, '2026-06-11 09:01:49', '2026-06-11 09:01:49', '0f92ab15-a76c-4715-aa77-fcf180658976') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201030466191', "PhoneNumberConfirmed" = true WHERE "Id" = '4d75dcd9-1256-49fa-aad6-ac0094f179b4';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('a2418331-0d89-4151-9574-7629341fc9c7', '+201030466191', true, '2026-05-28 13:46:04', '2026-05-28 13:46:04', '4d75dcd9-1256-49fa-aad6-ac0094f179b4') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201515935029', "PhoneNumberConfirmed" = true WHERE "Id" = '64194170-0cfb-49d8-a6a1-39d02008a8cb';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('9321963c-75f3-4a8b-ab0d-511d31974ddf', '+201515935029', true, '2026-06-04 16:25:32', '2026-06-04 16:25:32', '64194170-0cfb-49d8-a6a1-39d02008a8cb') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18146068683', "PhoneNumberConfirmed" = true WHERE "Id" = '98756aaf-6d72-4d7f-9e74-05477fd28449';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('e851ba53-0171-49bd-ab93-a6743aa632a0', '+18146068683', true, '2026-06-06 19:03:46', '2026-06-06 19:03:46', '98756aaf-6d72-4d7f-9e74-05477fd28449') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201110844461', "PhoneNumberConfirmed" = true WHERE "Id" = '1711bdc2-3859-4653-9b19-f6409f7fb22e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('497f7d4a-8cdc-4340-8411-07fdb7cdb5bb', '+201110844461', true, '2026-06-12 13:07:30', '2026-06-12 13:07:30', '1711bdc2-3859-4653-9b19-f6409f7fb22e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201212224619', "PhoneNumberConfirmed" = true WHERE "Id" = 'b3b79c42-4c1e-48e7-9c86-0a61a412ebc8';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('d8fd66af-9a66-42b1-af0e-cd5232e28acf', '+201212224619', true, '2026-06-11 17:12:09', '2026-06-11 17:12:09', 'b3b79c42-4c1e-48e7-9c86-0a61a412ebc8') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+18142068683', "PhoneNumberConfirmed" = true WHERE "Id" = '0a36c729-9566-46a9-b778-d2cd5b17191f';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('986e40af-b878-4bca-8947-56120189e7bf', '+18142068683', true, '2026-06-11 18:28:42', '2026-06-11 18:28:42', '0a36c729-9566-46a9-b778-d2cd5b17191f') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201204505835', "PhoneNumberConfirmed" = true WHERE "Id" = '45825b9f-5864-466c-b0f3-cd71994eff04';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('b6e9a350-026d-4025-a623-ac858c09a744', '+201204505835', true, '2026-06-14 10:09:53', '2026-06-14 10:09:53', '45825b9f-5864-466c-b0f3-cd71994eff04') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201028436136', "PhoneNumberConfirmed" = true WHERE "Id" = 'b7796e88-3130-4d0e-b53d-377bf758cc3c';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0cd57bde-d376-4aeb-8b45-bd06e9dafd3c', '+201028436136', true, '2026-06-19 11:44:26', '2026-06-19 11:44:26', 'b7796e88-3130-4d0e-b53d-377bf758cc3c') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+201010368714', "PhoneNumberConfirmed" = true WHERE "Id" = '1999fcb1-8b1c-490c-a7c7-37c376eb7d5e';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('0c22d072-fcdc-458f-89d6-2554a6f1f78d', '+201010368714', true, '2026-06-16 22:38:44', '2026-06-16 22:38:44', '1999fcb1-8b1c-490c-a7c7-37c376eb7d5e') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

UPDATE "AspNetUsers" SET "PhoneNumber" = '+966574266753', "PhoneNumberConfirmed" = true WHERE "Id" = '618b7250-c10c-4f86-bf79-f7d634b694f3';
INSERT INTO "PhoneNumbers" ("Id", "PhoneNumber", "TermsAccepted", "TermsAcceptedAt", "CreatedAt", "UserId") 
VALUES ('301fd9c9-ed78-4e81-a061-283b59a3b2aa', '+966574266753', true, '2026-06-23 17:34:28', '2026-06-23 17:34:28', '618b7250-c10c-4f86-bf79-f7d634b694f3') 
ON CONFLICT ("UserId") DO UPDATE SET "PhoneNumber" = EXCLUDED."PhoneNumber";

