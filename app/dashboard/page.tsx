import { PointerC, Row, UserDetails } from "../components/user-details";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { CodeSwitcher } from "../components/code-switcher";
import { LearnMore } from "../components/learn-more";
import { Footer } from "../components/footer";
import { ClerkLogo } from "../components/clerk-logo";
import { NextLogo } from "../components/next-logo";

import { DASHBOARD_CARDS } from "../consts/cards";

export default async function DashboardPage() {
  const { userId, debug } = auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  // const user = await currentUser();

  let totalCount = 0;
  let oauthError: {
    clerkTraceId?: string;
    errors: { code: string; message: string }[];
  } | null = null;
  try {
    ({ totalCount } = await clerkClient().users.getUserOauthAccessToken(
      userId,
      "oauth_google"
    ));
  } catch (error) {
    console.error("Error fetching OAuth access token:", error);
    console.log(debug());
    oauthError = error;
  }

  return (
    <>
      <main className="max-w-[75rem] w-full mx-auto">
        <div className="grid grid-cols-[1fr_20.5rem] gap-10 pb-10">
          <div>
            <header className="flex items-center justify-between w-full h-16 gap-4">
              <div className="flex gap-4">
                <ClerkLogo />
                <div aria-hidden className="w-px h-6 bg-[#C7C7C8]" />
                <NextLogo />
              </div>
              <div className="flex items-center gap-2">
                {/* <OrganizationSwitcher
                  appearance={{
                    elements: {
                      organizationPreviewAvatarBox: "size-6",
                    },
                  }}
                /> */}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-6",
                    },
                  }}
                />
              </div>
            </header>
            <UserDetails />
          </div>
          <div className="pt-[3.5rem]">
            <CodeSwitcher />
          </div>
          <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
            <Row desc="Google OAuth Tokens" value={totalCount.toString()} />
            {oauthError ? (
              <>
                <Row
                  desc="Clerk Trace ID"
                  value={oauthError.clerkTraceId || "N/A"}
                />
                <Row
                  desc="Clerk Error Code"
                  value={oauthError.errors[0].code || "N/A"}
                />
                <Row
                  desc="Clerk Error Message"
                  value={oauthError.errors[0].message || "N/A"}
                />
              </>
            ) : null}
          </div>
        </div>
      </main>
      <LearnMore cards={DASHBOARD_CARDS} />
      <Footer />
    </>
  );
}
