import toast from "react-hot-toast";

export function errorToast(message: any) {
    toast.error(message, {
        duration: 5000,
        style: {
            padding: "10px",
            backgroundColor: "#fff0f0",
            color: "#713200",
        },
        iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
        },
    });
}

export function successToast(message: any) {
    toast.success(message, {
        duration: 5000,
        style: {
            padding: "10px",
            backgroundColor: "#ecfdf3",
            color: "#713200",
        },
        iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
        },
    });
}