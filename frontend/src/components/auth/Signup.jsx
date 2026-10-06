import { useState } from "react";
import { supabase } from "../../lib/supabase";

function Signup() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        const { error } =
            await supabase.auth.signUp({
                email,
                password
            });

        if (error) {

            setError(error.message);

        } else {

            setMessage(
                "Account created. Check your email to confirm your account."
            );

        }

        setLoading(false);
    };

    return (
        <div className="auth-form">

            <div className="auth-heading">

                

              
            </div>

            <form onSubmit={handleSignup}>

                <div className="input-group">

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                </div>

                <div className="input-group">

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="auth-success">
                        {message}
                    </div>
                )}

                <button
                    className="auth-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating account..."
                        : "Create account"
                    }
                </button>

            </form>

        </div>
    );
}

export default Signup;