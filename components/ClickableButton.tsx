'use client';
import { Button } from "./ui/button";

// @ts-ignore
export function ClickableButton(props) {
    return (
        <Button onClick={() => navigator.clipboard.writeText(`https://artcast.ai/cast/${props.castId}`)}>{props.children}</Button>
    )
}