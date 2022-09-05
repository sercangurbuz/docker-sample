-- CreateTable
CREATE TABLE "todo" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(500),
    "done" BOOLEAN,
    "createdOn" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "doneOn" TIMESTAMPTZ,

    CONSTRAINT "todo_pkey" PRIMARY KEY ("id")
);
