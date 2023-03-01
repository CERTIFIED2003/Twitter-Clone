import { Form, Formik } from "formik";
import RegisterInput from "../inputs/registerinput";
import { useState } from "react";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import DateOfBirthSelect from "./DateOfBirthSelect";
import GenderSelect from "./GenderSelect";
import RiseLoader from "react-spinners/RiseLoader";
// import DotLoader from "react-spinners/DotLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ setVisible }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfos = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        bYear: new Date().getFullYear(),
        bMonth: new Date().getMonth() + 1,
        bDay: new Date().getDate(),
        gender: "",
    }
    const yearTemp = new Date().getFullYear();
    const [user, setUser] = useState(userInfos);
    const { first_name, last_name, email, password, bYear, bMonth, bDay, gender } = user;
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const years = Array.from(new Array(123), (val, index) => yearTemp - index);
    const months = Array.from(new Array(12), (val, index) => 1 + index);
    const getDays = () => {
        return new Date(bYear, bMonth, 0).getDate();
    }
    const days = Array.from(new Array(getDays()), (val, index) => 1 + index);

    const registerValidation = Yup.object({
        first_name: Yup.string()
            .required("Enter your First name!")
            .min(2, "First name must be between 2 to 16 characters!")
            .max(16, "First name must be between 2 to 16 characters!")
            .matches(/^[aA-zZ\s]+$/, "Numbers & Special Characters are not allowed."),
        last_name: Yup.string()
            .required("Enter your Last name!")
            .min(2, "Last name must be between 2 to 16 characters")
            .max(16, "Last name must be between 2 to 16 characters")
            .matches(/^[aA-zZ\s]+$/, "Numbers & Special Characters are not allowed."),
        email: Yup.string()
            .required("Enter your email address!")
            .email("Enter a valid email address!"),
        password: Yup.string()
            .required("Enter a strong password")
            .min(6, "Password must be atleast of 6 characters."),
        // .max(36, "Password must not be more than 36 characters")
    })


    const [dateError, setDateError] = useState("");
    const [genderError, setGenderError] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const registerSubmit = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`,
                {
                    first_name,
                    last_name,
                    email,
                    password,
                    bYear,
                    bMonth,
                    bDay,
                    gender,
                }
            );
            setError("");
            setSuccess(data.message);
            setLoading(false);
            const { message, ...rest } = data;
            setTimeout(() => {
                dispatch({ type: "LOGIN", payload: rest });
                Cookies.set("user", JSON.stringify(rest), { expires: 365 });
                navigate("/");
            }, 5000);
        }
        catch (error) {
            setLoading(false);
            setSuccess("");
            setError(error.response.data.message);
        }
    }

    return (
        <div className="blur">
            <div className="register">
                <div className="register_header">
                    <i onClick={() => setVisible(false)} className="exit_icon" />
                    <span style={{ color: "#F51997" }}>S</span>
                    <span style={{ marginRight: "7px" }}>ign</span>
                    <span style={{ color: "#F51997" }}>U</span>
                    <span>p</span>
                    {/* <span>Sign Up</span> */}
                </div>
                <div className="register_header_second">
                    <span>Join Us</span>
                </div>

                <Formik
                    enableReinitialize
                    initialValues={{ first_name, last_name, email, password, bYear, bMonth, bDay, gender }}
                    validationSchema={registerValidation}
                    onSubmit={() => {
                        let current_date = new Date();
                        let picked_date = new Date(bYear, bMonth - 1, bDay);
                        let atleast14 = new Date(1970 + 14, 0, 1);
                        let noMoreThan70 = new Date(1970 + 70, 0, 1);
                        if (gender === "") {
                            setGenderError("Choose your gender!");
                            if (current_date - picked_date < atleast14)
                                setDateError("You must be 14 years old to join Clang Social.");
                            if (current_date - picked_date > noMoreThan70)
                                setDateError("You must be less than 70 years old to join Clang Social.");
                        }
                        else if (current_date - picked_date < atleast14) {
                            setGenderError("");
                            setDateError("You must be 14 years old to join Clang Social.");
                        }
                        else if (current_date - picked_date > noMoreThan70) {
                            setGenderError("");
                            setDateError("You must be less than 70 years old to join Clang Social.");
                        }
                        else {
                            setLoading(true)
                            setDateError("");
                            setGenderError("");
                            registerSubmit();
                        }
                    }}
                >
                    {
                        (formik) => (
                            <Form className="register_form">
                                <div className="reg_line">
                                    <RegisterInput
                                        onChange={handleRegisterChange}
                                        type="text"
                                        placeholder="First Name"
                                        name="first_name"
                                    />
                                    <RegisterInput
                                        onChange={handleRegisterChange}
                                        type="text"
                                        placeholder="Last Name"
                                        name="last_name"
                                    />
                                </div>
                                <div className="reg_line">
                                    <RegisterInput
                                        onChange={handleRegisterChange}
                                        type="text"
                                        placeholder="Email"
                                        name="email"
                                    />
                                </div>
                                <div className="reg_line">
                                    <RegisterInput
                                        onChange={handleRegisterChange}
                                        type="password"
                                        placeholder="Create Password"
                                        name="password"
                                    />
                                </div>
                                <div className="reg_col">
                                    <div className="reg_line_header">
                                        Date of Birth
                                        {/* <i className="info_icon"></i> */}
                                    </div>
                                    <DateOfBirthSelect
                                        bDay={bDay}
                                        bMonth={bMonth}
                                        bYear={bYear}
                                        days={days}
                                        months={months}
                                        years={years}
                                        handleRegisterChange={handleRegisterChange}
                                        dateError={dateError}

                                    />
                                </div>
                                <div className="reg_col">
                                    <div className="reg_line_header">
                                        Gender
                                        {/* <i className="info_icon"></i> */}
                                    </div>
                                    <GenderSelect
                                        handleRegisterChange={handleRegisterChange}
                                        genderError={genderError}
                                    />
                                </div>
                                <div className="reg_infos">
                                    By clicking Sign Up, you agree to our{" "}
                                    <Link to="/"><span>Terms </span></Link>
                                    {/* <span>Terms, Data Policy &nbsp;</span> */}
                                    and <Link to="/"><span>Privacy Policy</span></Link>. You may receive email
                                    notifications from us and can opt out at any time.
                                </div>
                                {!loading
                                    ? <div className="reg_btn_wrapper">
                                        <button disabled={loading} className="pink_btn open_signup_second" type="submit">Sign Up</button>
                                    </div>
                                    : <div className="reg_btn_wrapper">
                                        <div className="pink_btn_second open_signup_second">
                                            <RiseLoader
                                                color="#fff"
                                                // color="#F51997"
                                                loading={loading}
                                                className="loading_btn"
                                                size={10}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </div>
                                    </div>
                                }
                                {error && <div className="error_text">{error}</div>}
                                {success && <div className="success_text">{success}</div>}
                            </Form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}
