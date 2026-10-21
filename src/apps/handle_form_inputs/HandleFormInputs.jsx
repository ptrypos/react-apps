import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HandleFormInputs.css';

function HandleFormInputs() {
    const [globalMessage, setGlobalMessage] = useState(null);
    const [isGlobalMessageAnError, setIsGlobalMessageAnError] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

    const togglePasswordShow = () => {
        setPasswordShow((prev) => !prev);
    }

    const toggleConfirmPasswordShow = () => {
        setConfirmPasswordShow((prev) => !prev);
    }

    const checkUsernameCharacters = (username) => {
        return /^[a-zA-Z0-9_-]{3,16}$/.test(username);
    };

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);

        if (newUsername.length > 0 && ((newUsername.length < 3 || newUsername > 16) || !checkUsernameCharacters(newUsername))) {
            setFieldErrors(prev => ({
                ...prev,
                username: "Username must be 3 - 16 characters. Only letters, numbers, underscores, and hyphens are allowed."
            }));
        } else {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.username;
                return newErrors;
            });
        }
    }

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        if (newEmail.length > 0 && !newEmail.includes('@')) {
            setFieldErrors(prev => ({
                ...prev,
                email: "Please enter a valid email address."
            }));
        } else {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.email;
                return newErrors;
            });
        }
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (newPassword.length > 0 && newPassword.length < 6) {
            setFieldErrors(prev => ({
                ...prev,
                password: "Password must be at least 6 characters."
            }));
        } else {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.password;
                return newErrors;
            });
        }
    };

    const calculateScore = (pwd) => {
        let score = 0;
        if (!pwd) return score;
        if (pwd.length > 7) score += 1;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
        return score;
    };

    const score = calculateScore(password);

    const getStrengthInfo = (score) => {
        if (score === 0) return { text: '', class: '' };
        if (score < 2) return { text: 'Weak', class: 'weak' };
        if (score < 4) return { text: 'Medium', class: 'medium' };
        return { text: 'Strong', class: 'strong' };
    };

    const { text, class: strengthClass } = getStrengthInfo(score);

    const handleSubmit = (e) => {
        e.preventDefault();

        setGlobalMessage(null);
        setIsGlobalMessageAnError(false);
        setFieldErrors({});

        let errors = {};

        if (!checkUsernameCharacters(username)) {
            errors.username = "Username must be 3 - 16 characters. Only letters, numbers, underscores, and hyphens are allowed.";
        }

        if (email === "") {
            errors.email = "Please enter an email address.";
        } else if (!email.includes('@')) {
            errors.email = "Please enter a valid email address.";
        }

        if (password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        if (password !== confirmPassword) {
            setGlobalMessage("Your passwords do not match. Please try again.");
            setIsGlobalMessageAnError(true);
            return;
        }

        setGlobalMessage("Form submitted successfully locally! No actual account was created.");

        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className='page-container'>
            <nav className='nav-bar'>
                <Link to='/' className='back-button'>&larr; Back to Dashboard</Link>
                <h2 className='nav-title'>Handle Form Inputs</h2>
                <div className='nav-spacer'></div>
            </nav>

            <div className='form-wrapper'>
                <form className='user-form' onSubmit={handleSubmit} noValidate>
                    <h3 className='form-title'>Create Account</h3>

                    {globalMessage && <div className={isGlobalMessageAnError ? "error-display" : "message-display"}>{globalMessage}</div>}

                    <div className='input-group'>
                        <label htmlFor='username' className='input-label'>Username</label>
                        <input id='username'
                            name='username'
                            className={`char-input ${fieldErrors.username ? 'input-error' : ''}`}
                            type='text'
                            placeholder='Choose a username'
                            value={username}
                            onChange={handleUsernameChange} />
                        {fieldErrors.username && <span className='field-error-text'>{fieldErrors.username}</span>}
                    </div>

                    <div className='input-group'>
                        <label htmlFor='email' className='input-label'>Email</label>
                        <input id='email'
                            name='email'
                            className={`char-input ${fieldErrors.email ? 'input-error' : ''}`}
                            type='email'
                            placeholder='name@example.com'
                            value={email}
                            onChange={handleEmailChange} />
                        {fieldErrors.email && <span className='field-error-text'>{fieldErrors.email}</span>}
                    </div>

                    <div className='input-group'>
                        <label htmlFor='password' className='input-label'>Password</label>
                        <div className='password-input-wrapper'>
                            <input id='password'
                                name='password'
                                className={`char-input ${fieldErrors.password ? 'input-error' : ''}`}
                                type={passwordShow ? 'text' : 'password'}
                                placeholder='Create a password'
                                value={password}
                                onChange={handlePasswordChange} />
                            <button
                                type='button'
                                className='toggle-visibility-btn'
                                onClick={togglePasswordShow}>
                                {passwordShow ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {fieldErrors.password && <span className='field-error-text'>{fieldErrors.password}</span>}

                        <div className="meter-container">
                            <div className={`meter-bar ${strengthClass}`} style={{ width: `${(score / 4) * 100}%` }}></div>
                        </div>
                        <p className={`strength-text ${strengthClass}`}>{text}</p>
                    </div>

                    <div className='input-group'>
                        <label htmlFor='confirmPassword' className='input-label'>Confirm Password</label>
                        <div className='password-input-wrapper'>
                            <input id='confirmPassword'
                                name='confirmPassword'
                                className={`char-input ${isGlobalMessageAnError ? 'input-error' : ''}`}
                                type={confirmPasswordShow ? 'text' : 'password'}
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button
                                type='button'
                                className='toggle-visibility-btn'
                                onClick={toggleConfirmPasswordShow}>
                                {confirmPasswordShow ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='submit-btn'
                        disabled={
                            Object.keys(fieldErrors).length > 0 ||
                            !username ||
                            !email ||
                            !password ||
                            !confirmPassword
                        }
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default HandleFormInputs;