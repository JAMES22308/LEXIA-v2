import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

function Auth() {

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSignup, setShowSignup] = useState(false);

    useEffect(() => {

        supabase.auth.getSession()
            .then(({ data }) => {

                setSession(data.session);
                setLoading(false);

            });

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {

                setSession(session);

            }
        );

        return () => {

            subscription.unsubscribe();

        };

    }, []);

    if (loading) {

        return (
            <div className="auth-page">
                <div className="auth-loading">
                    Loading...
                </div>
            </div>
        );

    }

    if (session) {

        return (
            <div className="auth-page">

                <div className="auth-card">

                    <div className="auth-logo">
                        LEXIA
                    </div>

                    <div className="auth-welcome">
                        <h2>Welcome back</h2>

                        <p>
                            {session.user.email}
                        </p>
                    </div>

                    <button
                        className="auth-logout-button"
                        onClick={async () => {
                            await supabase.auth.signOut();
                        }}
                    >
                        Sign out
                    </button>

                </div>

            </div>
        );

    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-brand">

                    <div className="auth-logo">
                        LEXIA
                    </div>

                    <p className="auth-tagline">
                        Your intelligent AI assistant
                    </p>

                </div>

                {showSignup ? (
                    <>
                        <Signup />

                        <button
                            className="auth-switch"
                            onClick={() => setShowSignup(false)}
                        >
                            Already have an account?{" "}
                            <strong>Sign in</strong>
                        </button>
                    </>
                ) : (
                    <>
                        <Login />

                        <button
                            className="auth-switch"
                            onClick={() => setShowSignup(true)}
                        >
                            Don't have an account?{" "}
                            <strong>Create one</strong>
                        </button>
                    </>
                )}

            </div>

        </div>
    );
}

export default Auth;