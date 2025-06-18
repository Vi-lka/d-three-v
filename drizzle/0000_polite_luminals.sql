CREATE TABLE "d-three-v_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "d-three-v_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "d-three-v_authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "d-three-v_authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "d-three-v_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "d-three-v_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "d-three-v_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "d-three-v_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "d-three-v_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "d-three-v_model" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255),
	"name" varchar(255) NOT NULL,
	"originalName" varchar(255) NOT NULL,
	"description" text,
	"fileUrl" text NOT NULL,
	"imageUrl" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "d-three-v_account" ADD CONSTRAINT "d-three-v_account_userId_d-three-v_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."d-three-v_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "d-three-v_authenticator" ADD CONSTRAINT "d-three-v_authenticator_userId_d-three-v_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."d-three-v_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "d-three-v_session" ADD CONSTRAINT "d-three-v_session_userId_d-three-v_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."d-three-v_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "d-three-v_model" ADD CONSTRAINT "d-three-v_model_userId_d-three-v_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."d-three-v_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "d-three-v_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "d-three-v_session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "model_user_id_idx" ON "d-three-v_model" USING btree ("userId");