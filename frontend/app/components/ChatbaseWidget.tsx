"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        chatbase: any;
    }
}


export default function ChatbaseWidget() {
    useEffect(() => {
        // Initialize Chatbase
        if (typeof window !== "undefined") {
            // Proxy setup for Chatbase
            if (!window.chatbase || (window.chatbase as any)("getState") !== "initialized") {
                (window as any).chatbase = (...args: any[]) => {
                    if (!(window as any).chatbase.q) {
                        (window as any).chatbase.q = [];
                    }
                    (window as any).chatbase.q.push(args);
                };

                (window as any).chatbase = new Proxy((window as any).chatbase, {
                    get(target: any, prop: string) {
                        if (prop === "q") {
                            return target.q;
                        }
                        return (...args: any[]) => target(prop, ...args);
                    },
                });
            }

            // Load the Chatbase script
            const onLoad = () => {
                const script = document.createElement("script");
                script.src = "https://www.chatbase.co/embed.min.js";
                script.id = "CUEcNvYW7Onh-8jiU5qI3";
                script.setAttribute("domain", "www.chatbase.co");
                script.defer = true;
                document.body.appendChild(script);
            };

            if (document.readyState === "complete") {
                onLoad();
            } else {
                window.addEventListener("load", onLoad);
                return () => window.removeEventListener("load", onLoad);
            }
        }
    }, []);

    return null;
}
