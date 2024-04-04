"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { toast } from "react-hot-toast";
import { themeOptions } from "@/server/cookie/theme";

export default function CreateForm() {
  async function setTheme(formData: FormData) {
    const theme = await themeOptions(formData);
    if (theme?.dark) {
      toast.success(theme.dark, {
        duration: 5000,
        style: {
          border: "1px solid #713200",
          padding: "12px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    }
    if (theme?.light) {
      toast.success(theme.light, {
        duration: 5000,
        style: {
          border: "1px solid #713200",
          padding: "12px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    }
    if (theme?.themeErrorlight) {
      toast.error(theme.themeErrorlight, {
        duration: 5000,
        style: {
          border: "1px solid #713200",
          padding: "12px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    }
    if (theme?.themeErrordark) {
      toast.error(theme.themeErrordark, {
        duration: 5000,
        style: {
          border: "1px solid #713200",
          padding: "12px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    }
  }
  return (
    <>
      <form action={setTheme}>
        <Input type="text" defaultValue="DARK" name="type" hidden />
        <SubmitButton text={"Dark"} />
      </form>
      <form action={setTheme}>
        <Input type="text" defaultValue="LIGHT" name="type" hidden />
        <SubmitButton text={"Light"} />
      </form>
    </>
  );
}
