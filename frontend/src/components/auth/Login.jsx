import { useState } from "react";
import { supabase } from "../../lib/supabase";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-form">

            

            <form onSubmit={handleLogin}>

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
                        placeholder="Enter your password"
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

                <button
                    className="auth-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Signing in..."
                        : "Sign in"
                    }
                </button>

            </form>

        </div>
    );
}

export default Login;