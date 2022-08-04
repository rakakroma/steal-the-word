import { useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";


export const Highlighter = ({ text, highlightWord, reverse }) => {
    const theme = useTheme()

    if (!highlightWord.trim() || !text.includes(highlightWord)) return <span>{text}</span>

    const regex = new RegExp(`(${highlightWord})`, "gi");
    const parts = text.split(regex);



    // const greyStyle = {
    //     backgroundColor: '',
    //     color: grey[800]
    // }


    const markStyle = {
        backgroundColor: '',
        color: theme.palette.primary.main
    }
    return (
        <span>
            {parts.map((part, i) => {
                return regex.test(part) ? (
                    <span style={markStyle} className="marked-word" key={i}>{part}</span>
                ) : (
                    <span key={i}>{part}</span>
                );
            })}
        </span>
    );
};

