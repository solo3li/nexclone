using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixMissingColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    -- ToolConfigurations
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ToolConfigurations' AND column_name='AllowPremiumCredits') THEN
                        ALTER TABLE ""ToolConfigurations"" ADD COLUMN ""AllowPremiumCredits"" boolean NOT NULL DEFAULT false;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ToolConfigurations' AND column_name='AllowStandardCredits') THEN
                        ALTER TABLE ""ToolConfigurations"" ADD COLUMN ""AllowStandardCredits"" boolean NOT NULL DEFAULT true;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ToolConfigurations' AND column_name='IsComingSoon') THEN
                        ALTER TABLE ""ToolConfigurations"" ADD COLUMN ""IsComingSoon"" boolean NOT NULL DEFAULT false;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ToolConfigurations' AND column_name='IsMaintenanceMode') THEN
                        ALTER TABLE ""ToolConfigurations"" ADD COLUMN ""IsMaintenanceMode"" boolean NOT NULL DEFAULT false;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ToolConfigurations' AND column_name='AdditionalSettings') THEN
                        ALTER TABLE ""ToolConfigurations"" ADD COLUMN ""AdditionalSettings"" jsonb NULL DEFAULT '{}'::jsonb;
                    END IF;

                    -- Plans
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='Features') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""Features"" text NULL;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='FeaturesAr') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""FeaturesAr"" text NULL;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='StandardCredits') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""StandardCredits"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='PremiumCredits') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""PremiumCredits"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='MonthlyCredits') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""MonthlyCredits"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='AffiliateFirstCommissionType') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""AffiliateFirstCommissionType"" character varying(50) NOT NULL DEFAULT 'Percentage';
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='AffiliateFirstCommissionValueUsd') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""AffiliateFirstCommissionValueUsd"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='AffiliateFirstCommissionValueEgp') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""AffiliateFirstCommissionValueEgp"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='AffiliateRecurringCommissionType') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""AffiliateRecurringCommissionType"" character varying(50) NOT NULL DEFAULT 'Percentage';
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='AffiliateRecurringCommissionValueUsd') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""AffiliateRecurringCommissionValueUsd"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='AffiliateRecurringCommissionValueEgp') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""AffiliateRecurringCommissionValueEgp"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='LipSyncCostPerSecond') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""LipSyncCostPerSecond"" numeric NOT NULL DEFAULT 0.2;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Plans' AND column_name='LipSyncMaxDurationSeconds') THEN
                        ALTER TABLE ""Plans"" ADD COLUMN ""LipSyncMaxDurationSeconds"" integer NOT NULL DEFAULT 60;
                    END IF;

                    -- AspNetUsers
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='FullName') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""FullName"" text NOT NULL DEFAULT '';
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='Country') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""Country"" text NOT NULL DEFAULT '';
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='IsVerified') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""IsVerified"" boolean NOT NULL DEFAULT false;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='LastVerificationEmailSentAt') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""LastVerificationEmailSentAt"" timestamp with time zone NULL;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='ImageUrl') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""ImageUrl"" text NULL;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='IsActive') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""IsActive"" boolean NOT NULL DEFAULT true;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='IsStaff') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""IsStaff"" boolean NOT NULL DEFAULT false;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='IsSuperAdmin') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""IsSuperAdmin"" boolean NOT NULL DEFAULT false;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='VisibleAdminSections') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""VisibleAdminSections"" text NULL;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='StandardCredits') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""StandardCredits"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='PremiumCredits') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""PremiumCredits"" numeric NOT NULL DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='AspNetUsers' AND column_name='CreatedAt') THEN
                        ALTER TABLE ""AspNetUsers"" ADD COLUMN ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
