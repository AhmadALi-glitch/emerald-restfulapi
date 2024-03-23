-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "avatar" TEXT,
    "xp_points" INTEGER NOT NULL,
    "professions" JSONB NOT NULL,
    "join_date" BIGINT NOT NULL,
    "about" TEXT NOT NULL,
    "team_id" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teamJoinRequests" (
    "team_creator_id" INTEGER,
    "applier_id" INTEGER,
    "appplyingDate" BIGINT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "teamJoinRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventJoinRequests" (
    "event_organizer_id" INTEGER,
    "applier_id" INTEGER,
    "appplyingDate" BIGINT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "eventJoinRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountsAchievments" (
    "account_id" INTEGER NOT NULL,
    "acheivment_id" INTEGER NOT NULL,

    CONSTRAINT "accountsAchievments_pkey" PRIMARY KEY ("account_id","acheivment_id")
);

-- CreateTable
CREATE TABLE "accountCheckpoints" (
    "executor_id" INTEGER NOT NULL,
    "checkpoint_id" INTEGER NOT NULL,

    CONSTRAINT "accountCheckpoints_pkey" PRIMARY KEY ("executor_id","checkpoint_id")
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "checked" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "create_date" BIGINT NOT NULL,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "xp_points" INTEGER NOT NULL,
    "avatar" TEXT,
    "create_date" BIGINT NOT NULL,
    "about" TEXT NOT NULL,
    "creator_id" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teamsAchievments" (
    "team_id" INTEGER NOT NULL,
    "achivment_id" INTEGER NOT NULL,

    CONSTRAINT "teamsAchievments_pkey" PRIMARY KEY ("team_id","achivment_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "paragraph" TEXT NOT NULL,
    "create_date" BIGINT NOT NULL,
    "author_id" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "paragraph" TEXT NOT NULL,
    "create_date" BIGINT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teamsEvents" (
    "team_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "teamsEvents_pkey" PRIMARY KEY ("team_id","event_id")
);

-- CreateTable
CREATE TABLE "organizersEvents" (
    "organizer_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "organizersEvents_pkey" PRIMARY KEY ("organizer_id","event_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date_utc" BIGINT NOT NULL,
    "end_date_utc" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "achievment_id" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desciption" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "work" TEXT NOT NULL,

    CONSTRAINT "Achievment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teamJoinRequests_applier_id_key" ON "teamJoinRequests"("applier_id");

-- CreateIndex
CREATE UNIQUE INDEX "eventJoinRequests_applier_id_key" ON "eventJoinRequests"("applier_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_achievment_id_key" ON "Event"("achievment_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamJoinRequests" ADD CONSTRAINT "teamJoinRequests_team_creator_id_fkey" FOREIGN KEY ("team_creator_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamJoinRequests" ADD CONSTRAINT "teamJoinRequests_applier_id_fkey" FOREIGN KEY ("applier_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventJoinRequests" ADD CONSTRAINT "eventJoinRequests_event_organizer_id_fkey" FOREIGN KEY ("event_organizer_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventJoinRequests" ADD CONSTRAINT "eventJoinRequests_applier_id_fkey" FOREIGN KEY ("applier_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountsAchievments" ADD CONSTRAINT "accountsAchievments_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountsAchievments" ADD CONSTRAINT "accountsAchievments_acheivment_id_fkey" FOREIGN KEY ("acheivment_id") REFERENCES "Achievment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountCheckpoints" ADD CONSTRAINT "accountCheckpoints_executor_id_fkey" FOREIGN KEY ("executor_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountCheckpoints" ADD CONSTRAINT "accountCheckpoints_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "Checkpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamsAchievments" ADD CONSTRAINT "teamsAchievments_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamsAchievments" ADD CONSTRAINT "teamsAchievments_achivment_id_fkey" FOREIGN KEY ("achivment_id") REFERENCES "Achievment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamsEvents" ADD CONSTRAINT "teamsEvents_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamsEvents" ADD CONSTRAINT "teamsEvents_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizersEvents" ADD CONSTRAINT "organizersEvents_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizersEvents" ADD CONSTRAINT "organizersEvents_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_achievment_id_fkey" FOREIGN KEY ("achievment_id") REFERENCES "Achievment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
