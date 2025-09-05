/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./components/layout.tsx":
/*!*******************************!*\
  !*** ./components/layout.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Layout)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction Layout({ children }) {\n    const [darkMode, setDarkMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        \"Layout.useState\": ()=>{\n            if (typeof document === \"undefined\") return false;\n            return document.documentElement.classList.contains(\"dark\");\n        }\n    }[\"Layout.useState\"]);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"Layout.useEffect\": ()=>{\n            if (typeof document === \"undefined\") return;\n            localStorage.setItem(\"nxp-theme\", darkMode ? \"dark\" : \"light\");\n            document.documentElement.classList.toggle(\"dark\", darkMode);\n        }\n    }[\"Layout.useEffect\"], [\n        darkMode\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"min-h-screen w-full relative grid grid-rows-[auto_1fr_auto] overflow-hidden\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                \"aria-hidden\": \"true\",\n                className: \"pointer-events-none fixed inset-0 -z-10\",\n                style: {\n                    background: darkMode ? \"radial-gradient(120% 120% at 50% 0%, rgba(8,12,18,0.35) 0%, rgba(8,12,18,0.55) 70%)\" : \"linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(248,250,255,0.92) 100%)\"\n                }\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/components/layout.tsx\",\n                lineNumber: 17,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n                className: \"sticky top-0 z-50 w-full px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between backdrop-blur border-b dark:bg-[#0F1621]/70 dark:border-white/10 bg-white/70 border-black/5\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                        src: \"/assets/Logo.png\",\n                        alt: \"Nutri Xpert Pro\",\n                        className: \"h-[64px] sm:h-[72px] w-auto\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/components/layout.tsx\",\n                        lineNumber: 28,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: ()=>setDarkMode((v)=>!v),\n                        className: \"inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition dark:bg-[#0F1621] dark:text-white dark:border-white/30 dark:hover:bg-[#152134] bg-white text-gray-800 border-black/20 hover:bg-gray-100\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                className: `h-2.5 w-2.5 rounded-full ${darkMode ? \"bg-[#2AF598] shadow-[0_0_10px_rgba(42,245,152,.9)]\" : \"bg-gray-400\"}`\n                            }, void 0, false, {\n                                fileName: \"/home/runner/workspace/components/layout.tsx\",\n                                lineNumber: 36,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                suppressHydrationWarning: true,\n                                children: darkMode ? \"Light Mode\" : \"Dark Mode\"\n                            }, void 0, false, {\n                                fileName: \"/home/runner/workspace/components/layout.tsx\",\n                                lineNumber: 37,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/runner/workspace/components/layout.tsx\",\n                        lineNumber: 30,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/runner/workspace/components/layout.tsx\",\n                lineNumber: 27,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"relative z-0 px-4 sm:px-6 py-8\",\n                children: children\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/components/layout.tsx\",\n                lineNumber: 41,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"footer\", {\n                className: \"w-full px-4 py-3 text-center text-xs dark:text-[#A9B8D4] dark:bg-[#0F1621]/70 text-gray-600 bg-white/70 backdrop-blur\",\n                children: \"\\xa9 2025 Nutri Xpert Pro. Todos os direitos reservados.\"\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/components/layout.tsx\",\n                lineNumber: 43,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/runner/workspace/components/layout.tsx\",\n        lineNumber: 16,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvbGF5b3V0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBbUQ7QUFFcEMsU0FBU0csT0FBTyxFQUFFQyxRQUFRLEVBQWlDO0lBQ3hFLE1BQU0sQ0FBQ0MsVUFBVUMsWUFBWSxHQUFHSiwrQ0FBUUE7MkJBQVU7WUFDaEQsSUFBSSxPQUFPSyxhQUFhLGFBQWEsT0FBTztZQUM1QyxPQUFPQSxTQUFTQyxlQUFlLENBQUNDLFNBQVMsQ0FBQ0MsUUFBUSxDQUFDO1FBQ3JEOztJQUVBVCxnREFBU0E7NEJBQUM7WUFDUixJQUFJLE9BQU9NLGFBQWEsYUFBYTtZQUNyQ0ksYUFBYUMsT0FBTyxDQUFDLGFBQWFQLFdBQVcsU0FBUztZQUN0REUsU0FBU0MsZUFBZSxDQUFDQyxTQUFTLENBQUNJLE1BQU0sQ0FBQyxRQUFRUjtRQUNwRDsyQkFBRztRQUFDQTtLQUFTO0lBRWIscUJBQ0UsOERBQUNTO1FBQUlDLFdBQVU7OzBCQUNiLDhEQUFDRDtnQkFDQ0UsZUFBWTtnQkFDWkQsV0FBVTtnQkFDVkUsT0FBTztvQkFDTEMsWUFBWWIsV0FDUix3RkFDQTtnQkFDTjs7Ozs7OzBCQUdGLDhEQUFDYztnQkFBT0osV0FBVTs7a0NBQ2hCLDhEQUFDSzt3QkFBSUMsS0FBSTt3QkFBbUJDLEtBQUk7d0JBQWtCUCxXQUFVOzs7Ozs7a0NBRTVELDhEQUFDUTt3QkFDQ0MsU0FBUyxJQUFNbEIsWUFBWW1CLENBQUFBLElBQUssQ0FBQ0E7d0JBQ2pDVixXQUFVOzswQ0FJViw4REFBQ1c7Z0NBQUtYLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRVYsV0FBVyx1REFBdUQsZUFBZTs7Ozs7OzBDQUM5SCw4REFBQ3FCO2dDQUFLQyx3QkFBd0I7MENBQUV0QixXQUFXLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFJOUQsOERBQUN1QjtnQkFBS2IsV0FBVTswQkFBa0NYOzs7Ozs7MEJBRWxELDhEQUFDeUI7Z0JBQU9kLFdBQVU7MEJBQXdIOzs7Ozs7Ozs7Ozs7QUFLaEoiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvY29tcG9uZW50cy9sYXlvdXQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExheW91dCh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSB7XG4gIGNvbnN0IFtkYXJrTW9kZSwgc2V0RGFya01vZGVdID0gdXNlU3RhdGU8Ym9vbGVhbj4oKCkgPT4ge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImRhcmtcIik7XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibnhwLXRoZW1lXCIsIGRhcmtNb2RlID8gXCJkYXJrXCIgOiBcImxpZ2h0XCIpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiZGFya1wiLCBkYXJrTW9kZSk7XG4gIH0sIFtkYXJrTW9kZV0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gdy1mdWxsIHJlbGF0aXZlIGdyaWQgZ3JpZC1yb3dzLVthdXRvXzFmcl9hdXRvXSBvdmVyZmxvdy1oaWRkZW5cIj5cbiAgICAgIDxkaXZcbiAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZSBmaXhlZCBpbnNldC0wIC16LTEwXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBkYXJrTW9kZVxuICAgICAgICAgICAgPyBcInJhZGlhbC1ncmFkaWVudCgxMjAlIDEyMCUgYXQgNTAlIDAlLCByZ2JhKDgsMTIsMTgsMC4zNSkgMCUsIHJnYmEoOCwxMiwxOCwwLjU1KSA3MCUpXCJcbiAgICAgICAgICAgIDogXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCByZ2JhKDI1NSwyNTUsMjU1LDAuOTApIDAlLCByZ2JhKDI0OCwyNTAsMjU1LDAuOTIpIDEwMCUpXCIsXG4gICAgICAgIH19XG4gICAgICAvPlxuXG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInN0aWNreSB0b3AtMCB6LTUwIHctZnVsbCBweC00IHNtOnB4LTYgcHktMiBzbTpweS0zIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBiYWNrZHJvcC1ibHVyIGJvcmRlci1iIGRhcms6YmctWyMwRjE2MjFdLzcwIGRhcms6Ym9yZGVyLXdoaXRlLzEwIGJnLXdoaXRlLzcwIGJvcmRlci1ibGFjay81XCI+XG4gICAgICAgIDxpbWcgc3JjPVwiL2Fzc2V0cy9Mb2dvLnBuZ1wiIGFsdD1cIk51dHJpIFhwZXJ0IFByb1wiIGNsYXNzTmFtZT1cImgtWzY0cHhdIHNtOmgtWzcycHhdIHctYXV0b1wiIC8+XG5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldERhcmtNb2RlKHYgPT4gIXYpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLXhsIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIGJvcmRlciB0cmFuc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICBkYXJrOmJnLVsjMEYxNjIxXSBkYXJrOnRleHQtd2hpdGUgZGFyazpib3JkZXItd2hpdGUvMzAgZGFyazpob3ZlcjpiZy1bIzE1MjEzNF1cbiAgICAgICAgICAgICAgICAgICAgIGJnLXdoaXRlIHRleHQtZ3JheS04MDAgYm9yZGVyLWJsYWNrLzIwIGhvdmVyOmJnLWdyYXktMTAwXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGgtMi41IHctMi41IHJvdW5kZWQtZnVsbCAke2RhcmtNb2RlID8gXCJiZy1bIzJBRjU5OF0gc2hhZG93LVswXzBfMTBweF9yZ2JhKDQyLDI0NSwxNTIsLjkpXVwiIDogXCJiZy1ncmF5LTQwMFwifWB9IC8+XG4gICAgICAgICAgPHNwYW4gc3VwcHJlc3NIeWRyYXRpb25XYXJuaW5nPntkYXJrTW9kZSA/IFwiTGlnaHQgTW9kZVwiIDogXCJEYXJrIE1vZGVcIn08L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9oZWFkZXI+XG5cbiAgICAgIDxtYWluIGNsYXNzTmFtZT1cInJlbGF0aXZlIHotMCBweC00IHNtOnB4LTYgcHktOFwiPntjaGlsZHJlbn08L21haW4+XG5cbiAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMyB0ZXh0LWNlbnRlciB0ZXh0LXhzIGRhcms6dGV4dC1bI0E5QjhENF0gZGFyazpiZy1bIzBGMTYyMV0vNzAgdGV4dC1ncmF5LTYwMCBiZy13aGl0ZS83MCBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgIMKpIDIwMjUgTnV0cmkgWHBlcnQgUHJvLiBUb2RvcyBvcyBkaXJlaXRvcyByZXNlcnZhZG9zLlxuICAgICAgPC9mb290ZXI+XG4gICAgPC9kaXY+XG4gICk7XG59Il0sIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJMYXlvdXQiLCJjaGlsZHJlbiIsImRhcmtNb2RlIiwic2V0RGFya01vZGUiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInRvZ2dsZSIsImRpdiIsImNsYXNzTmFtZSIsImFyaWEtaGlkZGVuIiwic3R5bGUiLCJiYWNrZ3JvdW5kIiwiaGVhZGVyIiwiaW1nIiwic3JjIiwiYWx0IiwiYnV0dG9uIiwib25DbGljayIsInYiLCJzcGFuIiwic3VwcHJlc3NIeWRyYXRpb25XYXJuaW5nIiwibWFpbiIsImZvb3RlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/layout.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/head */ \"(pages-dir-node)/./node_modules/next/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/layout */ \"(pages-dir-node)/./components/layout.tsx\");\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"Nutri Xpert Pro\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                        lineNumber: 10,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                        lineNumber: 11,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                lineNumber: 9,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_layout__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                    lineNumber: 14,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                lineNumber: 13,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUErQjtBQUVGO0FBQ2E7QUFFM0IsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxxQkFDRTs7MEJBQ0UsOERBQUNKLGtEQUFJQTs7a0NBQ0gsOERBQUNLO2tDQUFNOzs7Ozs7a0NBQ1AsOERBQUNDO3dCQUFLQyxNQUFLO3dCQUFXQyxTQUFROzs7Ozs7Ozs7Ozs7MEJBRWhDLDhEQUFDUCwwREFBTUE7MEJBQ0wsNEVBQUNFO29CQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7QUFJaEMiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvcGFnZXMvX2FwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiLi4vc3R5bGVzL2dsb2JhbHMuY3NzXCI7XG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XG5pbXBvcnQgSGVhZCBmcm9tIFwibmV4dC9oZWFkXCI7XG5pbXBvcnQgTGF5b3V0IGZyb20gXCIuLi9jb21wb25lbnRzL2xheW91dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8SGVhZD5cbiAgICAgICAgPHRpdGxlPk51dHJpIFhwZXJ0IFBybzwvdGl0bGU+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVwiIC8+XG4gICAgICA8L0hlYWQ+XG4gICAgICA8TGF5b3V0PlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L0xheW91dD5cbiAgICA8Lz5cbiAgKTtcbn0iXSwibmFtZXMiOlsiSGVhZCIsIkxheW91dCIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInRpdGxlIiwibWV0YSIsIm5hbWUiLCJjb250ZW50Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();