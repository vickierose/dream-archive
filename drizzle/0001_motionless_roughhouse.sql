ALTER TABLE "dreams" DROP CONSTRAINT "dreams_plot_length";--> statement-breakpoint
ALTER TABLE "dreams" ADD CONSTRAINT "dreams_plot_length" CHECK (length(btrim("dreams"."plot")) > 0);