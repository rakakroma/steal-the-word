import { css } from 'lit';

export const iconButtonStyle = css`
  .icon-button {
    color: grey;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
  .icon-button:hover {
    filter: drop-shadow(2px 1px 7px grey);
  }
`;

export const wordInfoBlockStyles = css`
        :host{
            font-size:12px;
            z-index:99999999;
            position:absolute;
            transform: translateX(-50%);
        }
        *{
            font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

        }

        #container{
            --block-background-color: white;
            --block-text-color:black;
            background-color:var(--block-background-color);
            color:var(--block-text-color);
            text-align:initial;
            width:390px;
            max-height:400px;
            overflow-y:overlay;
            display:flex;
            flex-direction:column;
            border:1px solid black;
            box-shadow: 3.0px 6.1px 6.1px hsl(0deg 0% 0% / 0.41);
            border-radius: 5px;
            white-space:normal;
            line-height:18px;
        }
        #container::-webkit-scrollbar {
  display: none;
}

        h3{
            font-size:16px;
            max-width:260px;
        }
        h3,h5,h6{
            display:inline-block;
            margin:0;
        }
        h5{
            font-size:13px;
        }
        p{
            font-size:12px;
            margin:0;
        }
        .context-link{
            color:grey;
            margin-right:6px;
            display:inline-block;
            height:16px;
            width:16px;
        }
        a{
            text-decoration:none;
        }
        .page-title{
            width:90%
            height:21px;
            display: flex;
            padding-left: 5px;
            align-items: center;
        }
        .page-title h6{
            margin-left:5px;
            font-size:12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width:287px;
        }
       img{
            width:15px;
            height:15px;
        }
        .date{
            color:grey;
            width:fit-content;
            margin-left:4px;
        }
  
        .icon{
            color:#00a282;
        }
        .rating-button{
            color:#ca6512;
            padding:0;
            border:0;
            background:transparent;
            cursor:pointer;
        }
        .new-definition-button:hover{
            background-color:#d2d2d2;
        }
        #definition-selector{
            padding-bottom:6px;
        }
        .edit-instruction-text{
            color:#11483d;
        }
        .all-input-container{
            display:flex;
        }
        input[type=text]{
            width:100%;
            background-color:var(--block-background-color);
            color:var(--block-text-color);
            border:none;
            outline:none;
        }
        .divider{
            border: 0;
            display:block;
            width: 98%;               
            background-color:var(--block-text-color);
            height: 1px;
            margin:0;
        }
        #heading-container{
            position:relative;
            display:flex;
            justify-content:space-between;   
            padding:4px;
        }
        #heading-left{
            width:65%;
        }
        #submit-section{
            display:flex;
            justify-content:flex-end;
        }
        #submit-section > button{
            min-width: fit-content;
            background-color:var(--block-background-color);
            border: 1px solid #b8b8b8;
            padding: 6px;
            border-radius: 10px;
            cursor: pointer;
            margin: 3px;   
            font-size:13px;     
            }

        #submit-button{
            color: rgb(89, 137, 138);
            }

        #submit-button:hover,  #submit-button:focus{
        background-color:#e9faf6;
        }

        #cancel-button{
            color:#797979
        }
        #cancel-button:hover,  #cancel-button:focus{
        background-color:#dedddd;
        color:black;
        }

        .editable{
            background:#efeeee;
            border-radius:4px;
            position:relative;

        }
        .editable:focus,.editable:focus-within{
            outline:2px solid #cecdcd;
            background:white;
        }
        .editable:hover{
            outline:3px solid #d2d2d2;
            background:white;
        }
        .editable.editable-valid{
            background:white;
         }

        .editable.editable-valid:focus{
            outline:2px solid #7bffc8;
            color:var(--block-text-color);
        }

        .validCheckmark{
            position:absolute;
            display: inline-block;
            bottom:5px;
            right:-30px;
        }
        #action-bar{
            width:35%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            position:absolute;
            right:6px;
            top:6px;
        }

        #context-textarea{
            outline:1px solid grey;
        }
        .definition-and-contexts-container{
            margin-left:8px;
            margin-right:8px;
            margin-bottom:5px;
        }

        .outer-context-container{
            position:relative;
            margin-left:9px;
            margin-right:14px;
            margin-bottom:3px;
        }
        .inner-context-container{
            display:flex;
            flex-direction:column;
            margin-top:3px;
            margin-bottom:1px;
        }
        .vertical-line{
            position:absolute;
            left:-7px;
            border-left: 2px solid rgb(128 128 128 / 13%);
            height:103%;
        }
        .count-context-num{
            font-size:14px;
            margin-right:10px;
        }
        .context-delete-checkbox{
            width:15px;
            height:15px;
        }
        select{
            background-color:var(--block-background-color);
            color:var(--block-text-color)
        }
        .annotation-input{
            border:none;
            margin-bottom:5px;
            padding-left:5px;
        }
        #word-input{
            font-size: 16px;
            border: none;
            font-weight: 700;
        }
        .highlighting{
            font-size:13px;
            cursor: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='12px' height='12px' viewBox='0 0 12 12' version='1.1'%3E%3Cg id='surface1'%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 5.445312 5.9375 C 5.074219 5.894531 4.699219 5.996094 4.398438 6.21875 C 4.0625 6.519531 3.835938 6.921875 3.742188 7.363281 C 3.652344 7.839844 3.394531 8.269531 3.015625 8.570312 C 2.941406 8.605469 2.875 8.652344 2.816406 8.707031 C 2.761719 8.765625 2.75 8.859375 2.796875 8.925781 C 2.835938 8.960938 2.882812 8.984375 2.929688 8.992188 C 4.035156 9.246094 5.449219 9.328125 6.355469 8.511719 C 6.730469 8.175781 6.902344 7.667969 6.816406 7.171875 C 6.730469 6.679688 6.394531 6.261719 5.929688 6.070312 C 5.777344 6 5.613281 5.957031 5.445312 5.9375 Z M 5.445312 5.9375 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 7.644531 6.507812 C 9.546875 4.34375 11.964844 1.371094 11.332031 0.738281 C 10.699219 0.105469 8.078125 3.058594 6.195312 5.125 C 6.839844 5.375 7.363281 5.875 7.644531 6.507812 Z M 7.644531 6.507812 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 2.488281 1.984375 L 2.289062 1.304688 C 1.742188 1.679688 1.304688 2.195312 1.019531 2.796875 L 1.683594 2.957031 C 1.878906 2.578125 2.15625 2.25 2.488281 1.984375 Z M 2.488281 1.984375 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.332031 4.332031 C 1.332031 4.253906 1.351562 4.175781 1.355469 4.097656 L 0.695312 3.9375 C 0.675781 4.082031 0.667969 4.226562 0.667969 4.371094 L 0.667969 5.40625 L 1.332031 5.40625 Z M 1.332031 4.332031 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.332031 7.667969 L 1.332031 6.59375 L 0.667969 6.59375 L 0.667969 7.628906 C 0.667969 7.796875 0.679688 7.960938 0.703125 8.125 L 1.363281 7.964844 C 1.347656 7.863281 1.339844 7.765625 1.332031 7.667969 Z M 1.332031 7.667969 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.714844 9.097656 L 1.046875 9.257812 C 1.332031 9.835938 1.757812 10.332031 2.289062 10.691406 L 2.492188 10.011719 C 2.171875 9.765625 1.90625 9.453125 1.714844 9.097656 Z M 1.714844 9.097656 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 4.332031 10.667969 C 4.074219 10.664062 3.816406 10.625 3.566406 10.554688 L 3.378906 11.195312 C 4.027344 11.378906 4.714844 11.378906 5.363281 11.195312 L 5.167969 10.535156 C 4.898438 10.617188 4.617188 10.664062 4.332031 10.667969 Z M 4.332031 10.667969 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 6.960938 9.082031 C 6.78125 9.421875 6.53125 9.722656 6.238281 9.964844 L 6.449219 10.695312 C 6.980469 10.332031 7.410156 9.839844 7.691406 9.261719 Z M 6.960938 9.082031 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 6.980469 2.953125 C 7.160156 2.757812 7.332031 2.574219 7.5 2.398438 C 7.226562 1.964844 6.871094 1.59375 6.449219 1.304688 L 6.238281 2.035156 C 6.542969 2.285156 6.796875 2.597656 6.980469 2.953125 Z M 6.980469 2.953125 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 4.332031 1.332031 C 4.617188 1.335938 4.898438 1.382812 5.167969 1.464844 L 5.359375 0.804688 C 4.710938 0.621094 4.027344 0.621094 3.378906 0.804688 L 3.566406 1.445312 C 3.816406 1.375 4.074219 1.335938 4.332031 1.332031 Z M 4.332031 1.332031 '/%3E%3C/g%3E%3C/svg%3E%0A"), auto;
        }
        .definition-selectable{
            display: flex;
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            padding: 8px;
            margin:3px;
        }
        #selection-or-add{
            padding:5px;
        }
        label{
            width:-webkit-fill-available;
        }
        .definition-index{
     margin-left: 8px;
    padding: 0 5px 0 5px;
    color: white;
    background-color: rgb(106, 159, 105);
    border-radius: 5px;
    font-size: 14px;
    display: block;
    width: fit-content;    
    }

            .tags-button-container{
                display:flex
            }
        `;
