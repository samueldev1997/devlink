import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps){
    return(
        <input
            {...props}
            className="border-0 outline-none h-8 rounded-md px-2 mb-3"
        />
    )
}