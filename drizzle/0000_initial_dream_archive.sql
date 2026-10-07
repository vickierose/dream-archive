CREATE TYPE "public"."dream_mood" AS ENUM('Peaceful', 'Joyful', 'Strange', 'Sad', 'Unsettling', 'Frightening');--> statement-breakpoint
CREATE TABLE "dream_symbols" (
	"user_id" uuid NOT NULL,
	"dream_id" uuid NOT NULL,
	"symbol_id" uuid NOT NULL,
	CONSTRAINT "dream_symbols_user_id_dream_id_symbol_id_pk" PRIMARY KEY("user_id","dream_id","symbol_id")
);
--> statement-breakpoint
CREATE TABLE "dreams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"plot" text NOT NULL,
	"dream_date" date NOT NULL,
	"mood" "dream_mood" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dreams_owner_id_unique" UNIQUE("user_id","id"),
	CONSTRAINT "dreams_title_not_blank" CHECK (length(btrim("dreams"."title")) > 0),
	CONSTRAINT "dreams_plot_length" CHECK (length(btrim("dreams"."plot")) > 0 and length("dreams"."plot") <= 3000)
);
--> statement-breakpoint
CREATE TABLE "symbols" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"emoji" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "symbols_owner_id_unique" UNIQUE("user_id","id"),
	CONSTRAINT "symbols_name_not_blank" CHECK (length(btrim("symbols"."name")) > 0),
	CONSTRAINT "symbols_emoji_not_blank" CHECK (length(btrim("symbols"."emoji")) > 0)
);
--> statement-breakpoint
ALTER TABLE "dream_symbols" ADD CONSTRAINT "dream_symbols_owned_dream_fk" FOREIGN KEY ("user_id","dream_id") REFERENCES "public"."dreams"("user_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dream_symbols" ADD CONSTRAINT "dream_symbols_owned_symbol_fk" FOREIGN KEY ("user_id","symbol_id") REFERENCES "public"."symbols"("user_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dreams" ADD CONSTRAINT "dreams_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbols" ADD CONSTRAINT "symbols_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dream_symbols_owner_symbol_idx" ON "dream_symbols" USING btree ("user_id","symbol_id","dream_id");--> statement-breakpoint
CREATE INDEX "dreams_owner_date_idx" ON "dreams" USING btree ("user_id","dream_date" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE UNIQUE INDEX "symbols_owner_name_unique" ON "symbols" USING btree ("user_id",lower(btrim("name")));