// // import {
// //   FindAndReplaceIcon,
// //   StarOutlineIcon,
// // } from '@spectrum-web-components/icons-workflow';
// import styled from 'styled-components';
// import React from 'react';
// import { LitElement } from 'lit';
// // const starPath = chrome.runtime.getURL('assets/img/icon-34.png');

// const starIconUrI =
//   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='18' viewBox='0 0 18 18' width='18'%3E%3Cdefs%3E%3Cstyle%3E .fill %7B fill: %23464646; %7D %3C/style%3E%3C/defs%3E%3Ctitle%3ES AEMScreens 18 N%3C/title%3E%3Crect id='Canvas' fill='%23ff13dc' opacity='0' width='18' height='18' /%3E%3Cpath class='fill' d='M6,1H1A1,1,0,0,0,0,2v9a1,1,0,0,0,1,1H6a1,1,0,0,0,1-1V2A1,1,0,0,0,6,1ZM6,11H1V2H6Zm5.89913-6.3302A1.66985,1.66985,0,1,1,13.569,6.33964,1.66986,1.66986,0,0,1,11.89913,4.6698ZM16,9.35106v3.04387a.46094.46094,0,0,1-.45456.4671h-.4545l-.45456,4.67087A.46094.46094,0,0,1,14.18182,18H12.81818a.461.461,0,0,1-.45456-.4671L11.90907,12.862h-.4545A.46093.46093,0,0,1,11,12.39493V9.35106a2.45068,2.45068,0,0,1,2.41669-2.48332h.16662A2.45068,2.45068,0,0,1,16,9.35106ZM18,1.5v6a.5.5,0,0,1-.5.5h-.61926a3.74371,3.74371,0,0,0-.71991-1H17V2H9V7h1.82977a3.72736,3.72736,0,0,0-.707,1H8.5A.5.5,0,0,1,8,7.5v-6A.5.5,0,0,1,8.5,1h9a.5.5,0,0,1,.5.49989Z' /%3E%3C/svg%3E";

// const Icon = styled.div`
//   width: 18px;
//   height: 18px;
//   background: url(${starIconUrI});
// `;

// export const WordRating = ({ stars }) => {
//   console.log(Arrow75Icon());

//   return (
//     <div>
//       {/* <img src={starIconUrI} /> */}
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         height="18"
//         viewBox="0 0 18 18"
//         width="18"
//       >
//         <defs></defs>
//         <title>S AEMScreens 18 N</title>
//         <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" />
//         <path
//           class="fill"
//           d="M6,1H1A1,1,0,0,0,0,2v9a1,1,0,0,0,1,1H6a1,1,0,0,0,1-1V2A1,1,0,0,0,6,1ZM6,11H1V2H6Zm5.89913-6.3302A1.66985,1.66985,0,1,1,13.569,6.33964,1.66986,1.66986,0,0,1,11.89913,4.6698ZM16,9.35106v3.04387a.46094.46094,0,0,1-.45456.4671h-.4545l-.45456,4.67087A.46094.46094,0,0,1,14.18182,18H12.81818a.461.461,0,0,1-.45456-.4671L11.90907,12.862h-.4545A.46093.46093,0,0,1,11,12.39493V9.35106a2.45068,2.45068,0,0,1,2.41669-2.48332h.16662A2.45068,2.45068,0,0,1,16,9.35106ZM18,1.5v6a.5.5,0,0,1-.5.5h-.61926a3.74371,3.74371,0,0,0-.71991-1H17V2H9V7h1.82977a3.72736,3.72736,0,0,0-.707,1H8.5A.5.5,0,0,1,8,7.5v-6A.5.5,0,0,1,8.5,1h9a.5.5,0,0,1,.5.49989Z"
//         />
//       </svg>
//       <TheIconButton>aaaa</TheIconButton>
//     </div>
//   );
// };

// export const TheIconButton = styled.button`
//   color: grey;
//   border: 0;
//   background: transparent;
//   cursor: pointer;
// `;

// const ActionBarContainer = styled.div`
//   width: 35%;
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   position: absolute;
//   right: 6px;
//   top: 6px;
// `;

// export const ActionBar = ({ mode }) => {
//   return (
//     <ActionBarContainer>
//       <TheIconButton>
//         {/* {FindAndReplaceIcon({ width: 15, height: 15 })} */}
//         {/* <FindReplace /> */}
//       </TheIconButton>
//     </ActionBarContainer>
//   );
// };
// // const   _headingElement() {
// //     const wordDefault = this.wordObj?.word || this.newWord;

// //     const actionBar = () => {
// //       const variantsAndMatchRuleButton = () => {
// //         return html`
// //           <hooli-tooltip text="add match rule">
// //             <button
// //               type="button"
// //               class="icon-button"
// //               id="add-match-rule"
// //               @click="${() => this._handleUpdateFormStatus('openMatchRule')}"
// //             >
// //               ${FindAndReplaceIcon({ width: 15, height: 15 })}
// //             </button>
// //           </hooli-tooltip>
// //         `;
// //       };
// //       const searchLinkButton = () => html`
// //             <hooli-tooltip text='search this word in Google'>
// //             <a href=https://www.google.com/search?q=${
// //               this.newWord || this.wordObj.word
// //             } target="_blank" >
// //             ${GlobeSearchIcon({ width: 15, height: 15 })}
// //             </hooli-tooltip>
// //             </a>`;

// //       if (['editWord', 'newWord'].includes(this.mode))
// //         return html`${searchLinkButton()} ${variantsAndMatchRuleButton()}`;
// //       if (this.mode === 'newContext') return html`${searchLinkButton()}`;

// //       if (this.mode === 'lookUp')
// //         return html` <hooli-tooltip text="search this word in Google">
// //             ${searchLinkButton()}
// //           </hooli-tooltip>
// //           <hooli-tooltip text="add new context">
// //             <button
// //               type="button"
// //               class="icon-button"
// //               id="add-new-context"
// //               @click="${() => (this.mode = 'newContext')}"
// //             >
// //               ${BoxAddIcon({ width: 15, height: 15 })}
// //             </button>
// //           </hooli-tooltip>
// //           <hooli-tooltip text="edit this word">
// //             <button
// //               type="button"
// //               class="icon-button"
// //               @click="${() => (this.mode = 'editWord')}"
// //             >
// //               ${EditIcon({ width: 15, height: 15 })}
// //             </button>
// //           </hooli-tooltip>
// //           <hooli-menu>
// //             <li slot="list-item" @click="${() => (this.mode = 'deleting')}">
// //               ${DeleteIcon({ width: 15, height: 15 })} Delete
// //             </li>
// //           </hooli-menu>`;
// //     };

// //     return html`
// //       <div id="heading-left">
// //         ${['newWord', 'editWord'].includes(this.mode)
// //           ? html`<input
// //                 name='word'
// //                 type='text'
// //                 id='word-input' class='editable'
// //                 @input="${this._handleValidInput}"
// //                  @keypress="${this._handleEnterSubmit}"
// //                  .value="${wordDefault}"
// //                  ></input>`
// //           : html`${this.mode === 'deleting'
// //                 ? html`<input type='checkbox' class='checkbox' name='delete-all' id='heading-word-delete-checkbox' @change="${this._handleCheckboxSelect}"></input>`
// //                 : null}
// //               <h3>${this.wordObj.word}</h3>`}
// //       </div>
// //       <div id="action-bar">${actionBar()}</div>
// //     `;
// //   }
