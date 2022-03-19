// ==UserScript==
// @name            RemoveAds
// @name:en         RemoveAds
// @version         1.8.7
// @description     需要配合AdBlock类软件使用！该脚本可以移除那些规避反广告功能或要求解除反广告功能的广告，仅此而已。
// @description:en  This script can remove the ads which avoiding or requesting you to stop blocking them. Just it.
// @author          AnnAngela
// @match           *://*/*
// @run-at          document-start
// @grant           unsafeWindow
// @grant           none
// @namespace       https://greasyfork.org/users/129402
// ==/UserScript==
/* eslint-disable no-magic-numbers */
/* global unsafeWindow */
"use strict";
(function () {
    /* 防止重复加载 */
    if (unsafeWindow.RemoveAds) { return; }
    // console.info('RemoveAds running.');
    unsafeWindow.removedAds = [];
    const MutationObserver = unsafeWindow.MutationObserver;
    const $$ = unsafeWindow.document.querySelectorAll.bind(unsafeWindow.document);
    const info = (that) => {
        console.info("RemoveAds: ", unsafeWindow.removedAds.push(that), "\nTarget:", that, "\nParentNode:", that.parentNode, "\nInnerText:", that.innerText);
    };

    if ((location.host.includes("bbs.nga.cn") || location.host.includes("bbs.ngacn.cc")) && location.pathname.includes("adpage_insert")) {
        const stylesheet = document.createElement("style");
        stylesheet.innerText = "html, body, * { display: none!important; }";
        unsafeWindow.document.body.appendChild(stylesheet);
        const jump = function jump() {
            if (unsafeWindow.getJump) {
                const _getJump = unsafeWindow.getJump.bind(unsafeWindow);
                unsafeWindow.getJump = function () { };
                _getJump();
            }
        };
        setInterval(jump, 10);
    } else if (location.hostname === "www.ruanyifeng.com") {
        console.info("RemoveAds: removed the anti-adb checker.");
        const c = setInterval(() => {
            const entrySponsor = unsafeWindow.document.querySelector(".entry-sponsor");
            if (entrySponsor) {
                entrySponsor.remove();
                clearInterval(c);
            }
            /* const mainContent = unsafeWindow.document.querySelector("#main-content");
            if (mainContent) {
                Object.defineProperty(mainContent, "innerHTML", {
                    configurable: false,
                    enumerable: false,
                    get: function () {
                        const temp = document.createElement("div");
                        temp.innerHTML = mainContent.outerHTML;
                        return temp.querySelector("#main-content").innerHTML;
                    },
                    set: function (value) {
                        if (value === "") {
                            const mainContentOuterHTML = mainContent.outerHTML;
                            setTimeout(() => {
                                mainContent.outerHTML = mainContentOuterHTML;
                            }, 1);
                            throw new Error("RemoveAds: Got a call from blockAdBlock tring removing the content of page.");
                        }
                        const temp = document.createElement("div");
                        temp.innerHTML = unsafeWindow.document.body.outerHTML;
                        let tag = unsafeWindow.document.body.outerHTML.replace(temp.innerHTML, "$$$$$$$$$$$$");
                        tag = tag.replace("$$$$$$</body>", value + "</body>");
                        unsafeWindow.document.body.outerHTML = tag;
                    },
                });
                clearInterval(c);
            } */
        }, 10);
    }
    const props = {
        admiral: {
            configurable: false,
            enumerable: false,
            writable: false,
            value: function () {
                console.info("RemoveAds: Got a call to admiral but denied.");
            },
        },
        blockAdBlock: {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {
                on: function (detected, fn) {
                    this[detected === true ? "onDetected" : "onNotDetected"](fn);
                },
                onDetected: function (fn) {
                    console.info("RemoveAds: Got a call to blockAdBlock.onDetected but denied, with callback function", fn);
                },
                onNotDetected: function (fn) {
                    console.info("RemoveAds: Got a call to blockAdBlock.onNotDetected but denied, with callback function", fn);
                },
            },
        },
        BlockAdBlock: {
            configurable: false,
            enumerable: false,
            writable: false,
            value: function (options) {
                console.info("RemoveAds: Got a call to BlockAdBlock but denied, with setting", options);
            },
        },
    };
    Object.defineProperties(unsafeWindow, props);

    let blockBlockAdBlockFlag = false;
    unsafeWindow.removeAd = function removeAd() {
        if (!location.host.includes("getadmiral.com")) {
            Array.from($$("body > :not([rmAd-admiral])")).forEach(function (that) {
                that.setAttribute("rmAd-admiral", "");
                if (that.querySelector('a[href^="https://getadmiral.com/pb"]')) {
                    info(that);
                    that.remove();
                }
            });
        }
        if (unsafeWindow.document.body.dataset.blockBlockAdBlock !== "true") {
            unsafeWindow.document.body.dataset.blockBlockAdBlock = "true";
            Object.defineProperty(unsafeWindow.document.body, "innerHTML", {
                configurable: false,
                enumerable: false,
                get: function () {
                    const temp = document.createElement("div");
                    temp.innerHTML = unsafeWindow.document.body.outerHTML;
                    return temp.innerHTML;
                },
                set: function (value) {
                    if (value === "") {
                        blockBlockAdBlockFlag = true;
                        throw new Error("RemoveAds: Got a call from blockAdBlock tring removing the content of page.");
                    }
                    const temp = document.createElement("div");
                    temp.innerHTML = unsafeWindow.document.body.outerHTML;
                    let tag = unsafeWindow.document.body.outerHTML.replace(temp.innerHTML, "$$$$$$$$$$$$");
                    tag = tag.replace("$$$$$$</body>", value + "</body>");
                    unsafeWindow.document.body.outerHTML = tag;
                },
            });
        }
        if (blockBlockAdBlockFlag) {
            Array.from($$("style:not([rmAd-blockAdBlock])")).forEach(function (that) {
                that.setAttribute("rmAd-blockAdBlock", "");
                if (that.innerText.includes("#yui3-css-stamp.cssreset{display:none}")) {
                    console.info("RemoveAds: Remove the blockAdBlock CSS", unsafeWindow.removedAds.push(that), "\n", that);
                    that.remove();
                }
            });
        }
        if (location.host.endsWith("baidu.com")) {
            Array.from($$("span:not([rmAd-baidu])")).forEach(function (that) {
                that.setAttribute("rmAd-baidu", "");
                if (/^(广告)+$/.test(that.innerText.replace(/s/g, ""))) {
                    info(that);
                    that.remove();
                }
            });
        }
        else if (location.host.endsWith("gamepedia.com")) {
            const siderail = document.querySelector("#siderail");
            if (siderail) { siderail.remove(); }
            const globalWrapper = document.querySelector("#global-wrapper.with-siderail");
            if (globalWrapper) { globalWrapper.classList.remove("with-siderail"); }
        } /* else if (location.host.includes("twitter.co")) {
            if (!unsafeWindow.document.querySelector("style#rmAd-twitter-style")) {
                const style = unsafeWindow.document.createElement("style");
                style.id = "rmAd-twitter-style";
                style.innerText = "html body div .rmAd-twitter-hidden { display: none !important; visibility: hidden !important; speak: none !important; position: fixed !important; top: 101vh !important; left: 101vw !important;}";
                unsafeWindow.document.body.appendChild(style);
            }
            Array.from($$('[data-testid="primaryColumn"] section > h1 + div > div > div > div:not([rmAd-twitter]):not(.rmAd-twitter-hidden), [data-testid="sidebarColumn"] > div > div > div > div > div > div:not([rmAd-twitter]):not(.rmAd-twitter-hidden)')).forEach(function (that) {
                that.setAttribute("rmAd-twitter", "");
                if (that.innerText.trim() === "") {
                    that.classList.add("rmAd-twitter-emptyblock");
                }
                if (that.querySelector('h2[role="heading"] > div[dir="auto"] > span')) {
                    that.classList.add("rmAd-twitter-h2");
                }
                if (that.querySelector('div[data-testid="UserCell"][role="button"]')
                    || that.querySelector('a[href*="/i/related_users/"]')) {
                    that.classList.add("rmAd-twitter-need2remove");
                }
            });
            Array.from($$(".rmAd-twitter-emptyblock + .rmAd-twitter-emptyblock:not(.rmAd-twitter-hidden)")).forEach(ele => ele.classList.add("rmAd-twitter-hidden"));
            const emptyblockRemove = (that) => {
                if (that.previousElementSibling && that.previousElementSibling.classList && that.previousElementSibling.classList.contains("rmAd-twitter-emptyblock") && !that.previousElementSibling.classList.contains("rmAd-twitter-hidden")) {
                    info(that.previousElementSibling);
                    that.previousElementSibling.classList.add("rmAd-twitter-hidden");
                }
                if (that.nextElementSibling && that.nextElementSibling.classList && that.nextElementSibling.classList.contains("rmAd-twitter-emptyblock") && !that.nextElementSibling.classList.contains("rmAd-twitter-hidden")) {
                    info(that.nextElementSibling);
                    that.nextElementSibling.classList.add("rmAd-twitter-hidden");
                }
            };
            Array.from($$(".rmAd-twitter-h2:not(.rmAd-twitter-hidden)")).forEach(that => {
                if (that.nextElementSibling && that.nextElementSibling.classList && that.nextElementSibling.classList.contains(".rmAd-twitter-need2remove")) {
                    info(that);
                    emptyblockRemove(that);
                    that.classList.add("rmAd-twitter-hidden");
                }
            });
            Array.from($$(".rmAd-twitter-need2remove:not(.rmAd-twitter-hidden)")).forEach(that => {
                if (that.previousElementSibling && that.previousElementSibling.classList && that.previousElementSibling.classList.contains("rmAd-twitter-h2")) {
                    info(that.previousElementSibling);
                    emptyblockRemove(that.previousElementSibling);
                    that.previousElementSibling.classList.add("rmAd-twitter-hidden");
                }
                info(that);
                emptyblockRemove(that);
                that.classList.add("rmAd-twitter-hidden");
            });
        } */
        const nodes = Array.from($$('[style*="important"]:not([removeAd-has-checked-for-inline-style])'));
        if (!nodes.length) { return; }
        nodes.forEach(function (that) {
            that.setAttribute("removeAd-has-checked-for-inline-style", "");
            const style = (that.attributes.style.textContent + "").replace(/\s/g, "");
            const display = (style.match(/display:([a-z-]+)!important/ig) || []).map(n => n.match(/display:([a-z-]+)!important/i)[1]);
            const displayCheck = [];
            display.forEach(function (n) {
                if (n !== "none") { displayCheck.push(n); }
            });
            if (displayCheck.length === 0) { return; }
            that.attributes.style.textContent = style.replace(/display:([a-z-]+)!important/ig, "");
            if (getComputedStyle(that).display === "none" || /^(广告)+$/.test(that.innerText.replace(/s/g, ""))) {
                that.attributes.style.textContent = style + "";
                info(that);
                that.remove();
            } else { that.attributes.style.textContent = style + ""; }
        });
    };
    document.addEventListener("DOMContentLoaded", function () {
        const callback = function () {
            unsafeWindow.removeAd();
            if (location.href.indexOf("www.baidu.com/s") !== -1) {
                Array.from($$("#content_left .c-container")).forEach(function (ele) {
                    if (ele.querySelector(".icon-unsafe-icon")) { ele.remove(); }
                    if (!ele.createShadowRoot) {
                        console.info("RemoveAds (shadowRoot): ", unsafeWindow.removedAds.push(ele), "\nTarget:", ele, "\nParentNode:", ele.parentNode, "\nInnerText", ele.innerText);
                        const html = ele.outerHTML;
                        const node = unsafeWindow.document.createElement("div");
                        ele.before(node);
                        node.outerHTML = html;
                        ele.remove();
                    }
                });
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(unsafeWindow.document.body, { attributes: true, childList: true, subtree: true });
        unsafeWindow.removeAd();
    });
})();