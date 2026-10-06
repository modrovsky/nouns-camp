import React from "react";
import { css } from "@emotion/react";
import Dialog from "@shades/ui-web/dialog";
import Button from "@shades/ui-web/button";
import DialogHeader from "@shades/ui-web/dialog-header";
import { useWallet, useWalletAuthentication } from "@/hooks/wallet";
import { useDialog } from "@/hooks/global-dialogs";
import { reportError } from "@/utils/monitoring";

const AccountAuthenticationDialog = ({ isOpen, close }) => {
  const { isAuthenticated } = useWallet();
  return (
    <Dialog
      isOpen={isOpen}
      onRequestClose={() => {
        close();
      }}
      width={isAuthenticated ? "34rem" : "42rem"}
    >
      {(props) => <Content dismiss={close} {...props} />}
    </Dialog>
  );
};

const Content = ({ titleProps, dismiss }) => {
  const { isAuthenticated } = useWallet();
  const { signIn: authenticateConnectedAccount, state: authenticationState } =
    useWalletAuthentication();
  const { data: dialogData } = useDialog("account-authentication");
  const userIntent = dialogData?.intent;
  const onSuccess = dialogData?.onSuccess;

  const isAuthenticating = authenticationState !== "idle";

  return (
    <div
      css={(t) =>
        css({
          padding: "1.6rem",
          "p + p": { marginTop: "1em" },
          ".small": {
            fontSize: t.text.sizes.small,
            color: t.colors.textDimmed,
            a: { color: "inherit" },
          },
          "p a": {
            color: t.colors.link,
            "&.plain": { color: "inherit", textDecoration: "none" },
            "&.inherit": { color: "inherit" },
          },
          b: { fontWeight: t.text.weights.emphasis },
          "@media (min-width: 600px)": { padding: "2rem" },
        })
      }
    >
      <DialogHeader
        title={isAuthenticated ? <>All done! 🎉</> : "Authenticate account"}
        titleProps={titleProps}
        dismiss={isAuthenticated ? dismiss : null}
      />
      <main>
        {isAuthenticated ? (
          <p>Your account is authenticated.</p>
        ) : (
          <>
            {
              <>
                {userIntent === "like" && (
                  <p>
                    Hey! Looks like you’re not logged in. Mind if we
                    authenticate your account real quick?
                  </p>
                )}
                <p className={userIntent === "like" ? "small" : undefined}>
                  Camp will prompt you to sign a little message according to the{" "}
                  <a
                    href="https://eips.ethereum.org/EIPS/eip-4361"
                    target="_blank"
                    rel="noreferrer"
                    className="inherit"
                  >
                    Sign-In with Ethereum
                  </a>{" "}
                  standard. This signature proves that you are in control of
                  your connected account.
                </p>
              </>
            }
          </>
        )}

        {isAuthenticating && (
          <p className="small">
            {(() => {
              switch (authenticationState) {
                case "requesting-signature":
                  return <>Awaiting signature... (check your wallet)</>;
                case "verifying-signature":
                  return <>Verifying signature...</>;
                default:
                  throw new Error();
              }
            })()}
          </p>
        )}
      </main>
      {!isAuthenticated && (
        <footer
          css={css({
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "2.5rem",
            "@media (min-width: 600px)": {
              paddingTop: "3rem",
            },
          })}
        >
          <div css={css({ display: "flex", gap: "1rem" })}>
            <Button type="button" size="medium" onClick={dismiss}>
              Cancel
            </Button>
            <Button
              size="medium"
              variant="primary"
              type="button"
              onClick={async () => {
                try {
                  await authenticateConnectedAccount();
                  onSuccess?.();
                } catch (e) {
                  console.error(e);
                  reportError(e);
                  alert("Ops, looks like something went wrong");
                }
              }}
              disabled={isAuthenticating}
              isLoading={isAuthenticating}
            >
              Let’s do it!
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AccountAuthenticationDialog;
