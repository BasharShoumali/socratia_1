import { useState } from "react";
import useTheme from "../../../hooks/useTheme";
import ForgetPasswordLayout from "./ForgetPasswordLayout";
import ForgetPasswordSteps from "./ForgetPasswordSteps";
import ForgetPasswordActions from "./ForgetPasswordActions";
import ForgetPasswordLinks from "./ForgetPasswordLinks";

export default function ForgetPasswordForm({ onSuccess }) {
  const { theme } = useTheme();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (step === "email") {
        setMessage("Verification code sent to your email");
        setStep("verify");
      } else if (step === "verify") {
        setStep("reset");
      } else {
        setMessage("Password reset successfully!");
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgetPasswordLayout theme={theme}>
      <h1 className="text-2xl font-bold">Reset Your Password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ForgetPasswordSteps
          step={step}
          email={email}
          setEmail={setEmail}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />

        {error && <div>{error}</div>}
        {message && <div>{message}</div>}

        <ForgetPasswordActions step={step} loading={loading} theme={theme} />
      </form>

      <ForgetPasswordLinks />
    </ForgetPasswordLayout>
  );
}
