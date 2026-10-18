import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HandleFormInputs.css';

function HandleFormInputs() {
    const [globalError, setGlobalError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [password, setPassword] = useState('');
    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

    const togglePasswordShow = () => {
        setPasswordShow((prev) => !prev);
    }

    const toggleConfirmPasswordShow = () => {
        setConfirmPasswordShow((prev) => !prev);
    }

    const validateUsername = (username) => {
        return /^[a-zA-Z0-9_-]{3,16}$/.test(username);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setGlobalError(null);
        setFieldErrors({});

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const email = formData.get('email');
        const confirmPassword = formData.get('confirmPassword');

        let errors = {};

        if (!validateUsername(username)) {
            errors.username = "Username must be 3 - 16 characters. Only letters, numbers, underscores, and hyphens are allowed.";
        }
        
        if (email === "") {
            errors.email = "Please enter an email address."
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
            setGlobalError("Your passwords do not match. Please try again.");
            return;
        }

        alert("Account created successfully!");

        e.target.reset();
        setPassword('');
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

                    {globalError && <div className='error-display'>{globalError}</div>}

                    <div className='input-group'>
                        <label htmlFor='username' className='input-label'>Username</label>
                        <input id='username'
                            name='username'
                            className={`char-input ${fieldErrors.username ? 'input-error' : ''}`}
                            type='text'
                            placeholder='Choose a username' />
                        {fieldErrors.username && <span className='field-error-text'>{fieldErrors.username}</span>}
                    </div>

                    <div className='input-group'>
                        <label htmlFor='email' className='input-label'>Email</label>
                        <input id='email'
                            name='email'
                            className={`char-input ${fieldErrors.email ? 'input-error' : ''}`}
                            type='email'
                            placeholder='name@example.com' />
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
                                onChange={(e) => setPassword(e.target.value)} />
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
                                className={`char-input ${globalError ? 'input-error' : ''}`}
                                type={confirmPasswordShow ? 'text' : 'password'}
                                placeholder='Confirm password' />
                            <button 
                                type='button' 
                                className='toggle-visibility-btn' 
                                onClick={toggleConfirmPasswordShow}>
                                {confirmPasswordShow ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button type='submit' className='submit-btn'>Register</button>
                </form>
            </div>
        </div>
    );
}

export default HandleFormInputs;