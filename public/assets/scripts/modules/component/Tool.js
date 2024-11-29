import {GetPeriodOfAYear} from "../app/SystemFunctions.js";

export function Ajax({
                         type,
                         url,
                         success,
                         error,
                         progress,
                         data,
                         formData,
                         serialized,
                     }) {
    let request = new XMLHttpRequest();
    let form = new FormData();

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                success && success(request.responseText);
            } else if (request.status === 400) {
                error && error("There was an error 400");
            } else {
                error && error("something else other than 200 was returned");
            }
        }
    };

    if (progress) {
        request.onprogress = progress;
    }

    if (data) {
        Object.entries(data).forEach((pair) => form.append(pair[0], pair[1]));
    }

    request.open(type, url, true);
    request.send(serialized || (data ? form : false) || formData);
}

export function ManageShowHideContainer(ClickClassName) {
    const SHControllers = document.querySelectorAll(
        ".show-hide-container-controller"
    );

    for (const SH of SHControllers) {
        const el = SH.querySelector("." + ClickClassName) ?? SH;

        FNOnClickOutside(SH, () => {
            SH.classList.remove("active");
            SH.classList.remove("show");
        });

        el.addEventListener("click", () => {
            if (SH.classList.contains("show")) {
                SH.classList.remove("active");
                SH.classList.remove("show");
            } else {
                SH.classList.add("active");
                SH.classList.add("show");
            }
        });
    }
}

export function ListenToSelectionTab(TAB, listeners = {}) {
    if (!TAB) return false;

    const LINKS = TAB.querySelectorAll(".selection-tab-link-container");
    const CONTENTS = TAB.querySelectorAll(".selection-tab-content-container");

    const findLinkContent = (link) => {
        for (const content of CONTENTS) {
            const tab = content.getAttribute("data-tab");
            const linkref = link.getAttribute("data-tab-link-for");

            if (tab === linkref) {
                return content;
            }
        }

        return null;
    };

    const viewLink = (link, bool) => {
        const content = findLinkContent(link);

        ToggleComponentClass(link, "active", bool);

        if (!content) return;

        HideShowComponent(content, bool);

        ExecuteFn(listeners, "onTab", link, content);
    };

    const reset = () => {
        for (const link of LINKS) {
            viewLink(link, false);
        }
    };

    const addListener = () => {
        for (const link of LINKS) {
            link.addEventListener("click", () => {
                reset();
                viewLink(link, true);
            });
        }
    };


    addListener();
    reset();
    viewLink(LINKS[0], true);
    ExecuteFn(listeners, "onReady");
}

export function ResetActiveComponent(components) {
    for (const component of components) {
        SetActiveComponent(component, false);
    }
}

export function SetActiveComponent(component, bool) {
    if (component) {
        if (bool) {
            component.classList.add("active");
        } else {
            component.classList.remove("active");
        }
    }
}

export function ComponentsClickSetActive(components, callback) {
    for (const component of components) {
        component.addEventListener("click", () => {
            ResetActiveComponent(components);
            ResetIconSwitchComponent(components);
            SetActiveComponent(component, true);
            IconSwitchComponent(component, true);

            if (callback) {
                const parent = component.parentNode;
                callback(component, Array.from(parent.children).indexOf(component));
            }
        });
    }
}

export function ResetIconSwitchComponent(items) {
    for (const item of items) {
        IconSwitchComponent(item, false);
    }
}

export function IconSwitchComponent(item, bool) {
    const def = item.querySelector(".icon-default");
    const rep = item.querySelector(".icon-replace");

    if (def && rep) {
        HideShowComponent(def, !bool);
        HideShowComponent(rep, bool);
    }
}

export function ManageIconSwitchOnActive() {
    const iconSwitchActives = document.querySelectorAll(
        ".items-icon-switch-active"
    );

    for (const ISA of iconSwitchActives) {
        const items = ISA.querySelectorAll(".icon-switch-item");

        const reset = () => {
            for (const item of items) {
                IconSwitchComponent(item, false);
                SetActiveComponent(item, false);
            }
        };

        for (const item of items) {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                reset();
                IconSwitchComponent(item, true);
                SetActiveComponent(item, true);
            });
        }
    }
}



export function FNOnClickOutside(element, callback, except, excallback) {
    const outSideExcepts = (target) => {
        if (Array.isArray(except)) {
            for (const ex of except) {
                if (!ex.contains(target)) {
                    return true;
                }
            }
        } else return except ? !except.contains(target) : true;
    }

    const listener = (e) => {
        const outsideExcept = outSideExcepts(e.target);

        if (!element.contains(e.target)) {
            if (outsideExcept) {
                callback && callback();
            } else {
                excallback && excallback();
            }
        }
    };

    window.addEventListener("click", listener);

    return listener;
}

export function FileToJson(fileObject) {
    fileObject.toJSON = function () {
        return {
            lastModified: fileObject.lastModified,
            lastModifiedDate: fileObject.lastModifiedDate,
            name: fileObject.name,
            size: fileObject.size,
            type: fileObject.type,
        };
    };

    return JSON.stringify(fileObject);
}

export function Serialize(mixed_value) {
    var val,
        key,
        okey,
        ktype = "",
        vals = "",
        count = 0,
        _utf8Size = function (str) {
            var size = 0,
                i = 0,
                l = str.length,
                code = "";
            for (i = 0; i < l; i++) {
                code = str.charCodeAt(i);
                if (code < 0x0080) {
                    size += 1;
                } else if (code < 0x0800) {
                    size += 2;
                } else {
                    size += 3;
                }
            }
            return size;
        },
        _getType = function (inp) {
            var match,
                key,
                cons,
                types,
                type = typeof inp;

            if (type === "object" && !inp) {
                return "null";
            }

            if (type === "object") {
                if (!inp.constructor) {
                    return "object";
                }
                cons = inp.constructor.toString();
                match = cons.match(/(\w+)\(/);
                if (match) {
                    cons = match[1].toLowerCase();
                }
                types = ["boolean", "number", "string", "array"];
                for (key in types) {
                    if (cons == types[key]) {
                        type = types[key];
                        break;
                    }
                }
            }
            return type;
        },
        type = _getType(mixed_value);

    switch (type) {
        case "function":
            val = "";
            break;
        case "boolean":
            val = "b:" + (mixed_value ? "1" : "0");
            break;
        case "number":
            val =
                (Math.round(mixed_value) == mixed_value ? "i" : "d") +
                ":" +
                mixed_value;
            break;
        case "string":
            val = "s:" + _utf8Size(mixed_value) + ':"' + mixed_value + '"';
            break;
        case "array":
        case "object":
            val = "a";
            for (key in mixed_value) {
                if (mixed_value.hasOwnProperty(key)) {
                    ktype = _getType(mixed_value[key]);
                    if (ktype === "function") {
                        continue;
                    }

                    okey = key.match(/^[0-9]+$/) ? parseInt(key, 10) : key;
                    vals += Serialize(okey) + Serialize(mixed_value[key]);
                    count++;
                }
            }
            val += ":" + count + ":{" + vals + "}";
            break;
        case "undefined":
        // Fall-through
        default:
            // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
            val = "N";
            break;
    }
    if (type !== "object" && type !== "array") {
        val += ";";
    }
    return val;
}

export function CombineFormData(formdata1, formdata2) {
    for (const pair of formdata2.entries()) {
        formdata1.append(pair[0], pair[1]);
    }

    return formdata1;
}

export function ToData(obj) {
    const data = new FormData();

    for (const pair of Object.entries(obj)) {
        data.append(pair[0], pair[1]);
    }

    return Object.fromEntries(data);
}

export function addClass(element, className) {
    if (!element || !className) return;

    if (Array.isArray(className)) {
        for (const cn of className) {
            if (cn.length) {
                element.classList.add(cn);
            }
        }
    } else {
        element.classList.add(className);
    }
}

export function removeClass(element, className) {
    if (!element || !className) return;

    element.classList.remove(className);
}


export function addAttr(element, attr, value) {
    if (!element || !attr || !value) return;

    element.setAttribute(attr, value);
}

export function append(element, toAppend) {
    if (!element || !toAppend) return;

    if (Array.isArray(toAppend)) {
        for (const a of toAppend) {
            element.appendChild(a);
        }
    } else {
        element.appendChild(toAppend);
    }
}

export function prepend(element, toAppend) {
    if (!element || !toAppend) return;

    if (Array.isArray(toAppend)) {
        for (const a of toAppend) {
            element.prepend(a);
        }
    } else {
        element.prepend(toAppend);
    }
}

export function addListener(element, listener, callback) {
    if (!element || !listener || !callback) return;

    element.addEventListener(listener, callback);
}

export function addText(element, text) {
    if (!element || !text) return;

    element.textContent = text;
}

export function addHtml(element, html) {
    if (!element || html === undefined) return;

    element.innerHTML = html;
}

export function addHypenOnUpper(str) {
    let strfinal = "";

    for (const letter of str) {
        if (letter === letter.toUpperCase()) {
            strfinal += "-" + letter.toLowerCase();
        } else {
            strfinal += letter;
        }
    }

    return strfinal;
}

export function GetClientRect(element) {

}

export function ObjToStyle(obj) {
    return Object.entries(obj)
        .map((style) => {
            return `${addHypenOnUpper(style[0])}:${style[1]}`;
        })
        .join(";")
        .toString();
}

export function addStyles(element, styles = {}) {
    if (!element) return;
    addAttr(element, "style", ObjToStyle(styles));
}

export function CreateElement(element) {
    const {el, className, classes, id, listener, attr} = element;
    const {child, childs, text, html, styles} = element;
    const elem = document.createElement(el ?? "DIV");

    if (className) {
        addClass(elem, className);
    }
    if (classes) {
        classes.forEach(cls => addClass(elem, cls));
    }
    addAttr(elem, "id", id);
    append(elem, child);
    addText(elem, text);
    addHtml(elem, html);
    addStyles(elem, styles);

    listener &&
    Object.entries(listener).forEach((pair) => {
        addListener(elem, pair[0], pair[1]);
    });

    attr &&
    Object.entries(attr).forEach((pair) => {
        addAttr(elem, pair[0], pair[1]);
    });

    childs && childs.length && childs.forEach((c) => append(elem, c));

    return elem;
}

export function randomDigit() {
    return Math.floor(Math.random() * Math.floor(2));
}

export function generateRandomBinary(binaryLength) {
    let binary = "0b";
    for (let i = 0; i < binaryLength; ++i) {
        binary += randomDigit();
    }
    return binary;
}

export function MakeID(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return [...new Array(length)].map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join("").toString();
}

export function ArrPairToObj(arrays) {
    const obj = {};

    for (const pair of arrays) {
        obj[pair[0]] = pair[1];
    }

    return obj;
}

export function VerifyFormData(formData, except = [], options = []) {
    let status = true;
    let empty = [];

    for (const pair of formData.entries()) {
        if (!except.includes(pair[0])) {
            if (typeof pair[1] == "object") {
                if (!pair[1].size) {
                    status = false;
                    empty.push(pair[0]);
                }
            } else {
                if (!options.length || options.length && options.filter(a => a.input == pair[0]).length === 0) {
                    if (pair[1].length === 0) {
                        status = false;
                        empty.push(pair[0]);
                    }
                } else {
                    const option = options.filter(a => a.input == pair[0])[0];

                    if (pair[1].length === 0 || pair[1].length < option.min) {
                        status = false;
                        empty.push(pair[0]);
                    }

                    if (option.compare) {
                        const compareValue = formData.get(option.compare);
                        if (compareValue !== pair[1]) {
                            status = false;
                            empty.push(pair[0]);
                        }
                    }
                }
            }
        }
    }

    return {status, empty};
}

export function FindParent(el, cn) {
    let parent = el.parentNode;

    while (parent) {
        if (parent.classList) {
            if (parent.classList.contains(cn)) {
                break;
            }
        }
        parent = parent.parentNode;
    }

    return parent;
}

export const ApplySuccess = (input, success) => {
    if (!input) return;

    const parent = FindParent(input, "error-container");

    if (parent) {
        parent.classList.remove("input-error");

        if (success) {
            parent.classList.add("input-success");
        } else {
            parent.classList.remove("input-success");
        }
    }
};
export const ApplyError = (inputErr, INPUTS, remove = false) => {
    if (!INPUTS) return;

    const addInputListener = (parent, input) => {
        const listener = function () {
            if (input.value.length > 0) {
                parent.classList.remove("input-error");
                input.removeEventListener("change", listener);
            }
        }

        input.addEventListener("change", listener)
    }

    if (!IsNodeList(INPUTS)) {
        const textareas = INPUTS.querySelectorAll("textarea");
        INPUTS = INPUTS.querySelectorAll("input");

        if (!IsNodeList(INPUTS)) {
            return;
        }

        for (const textarea of textareas) {
            INPUTS = [...textareas, ...INPUTS];
        }
    }

    for (const input of INPUTS) {
        if (input.getAttribute("type") !== "submit") {
            const parent = FindParent(input, "error-container");

            if (parent) {
                if (!remove) {
                    if (inputErr.includes(input.getAttribute("name"))) {
                        parent.classList.add("input-error");

                        addInputListener(parent, input)
                    } else {
                        parent.classList.remove("input-error");
                    }
                } else {
                    parent.classList.remove("input-error");
                }
            }
        }
    }
};

export function IsNodeList(nodes) {
    var stringRepr = Object.prototype.toString.call(nodes);

    return (
        typeof nodes === "object" &&
        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
        typeof nodes.length === "number" &&
        (nodes.length === 0 ||
            (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
    );
}

export function GetComboValue(combo) {
    const input = combo.querySelector("input");
    return {value: input.getAttribute("data-value"), text: input.value};
}

export function SetNewComboItems(combo, items, callback) {
    if (!combo) return;

    ResetListenerOfCombo(combo);

    const floatingContainer = combo.querySelector(".floating-container");
    floatingContainer.innerHTML = "";

    if (Array.isArray(items) && items.length > 0) {
        items.forEach(item => {
            if (typeof item === "string") {
                AddNewComboItem(combo, item, item);
            } else if (typeof item === "object" && item.hasOwnProperty("value") && item.hasOwnProperty("text")) {
                AddNewComboItem(combo, item.value, item.text);
            }
        });
    } else if (typeof items === "object" && items.hasOwnProperty("value") && items.hasOwnProperty("text")) {
        items.value.forEach((value, index) => {
            AddNewComboItem(combo, value, items.text[index]);
        });
    }

    ListenToThisCombo(combo, callback);
}

export function AddNewComboItem(combo, value, text) {
    if (!combo) return;

    const floatingcon = combo.querySelector(".floating-container");

    const element = CreateElement({
        el: "DIV",
        className:"item",
        attr: { value: value },
        child: CreateElement({
            el: "SPAN",
            text: text
        })
    });

    append(floatingcon, element);
}

export function SetComboValue(combo, text, value) {
    const input = combo.querySelector("input");

    input.value = text;

    input.setAttribute("data-value", value);
}

export function HideItemsInCombo(combo, toHide) {
    const floating = combo.querySelector(".floating-container");
    const items = floating.querySelectorAll(".item");

    for (const item of items) {
        if (toHide.includes(item.textContent)) {
            item.style.display = "none";
        } else {
            item.style.display = "flex";
        }
    }
}

export function ManageComboBoxes() {
    const CUSTOMCOMBOBOXS = document.querySelectorAll(".custom-combo-box");
    for (const combo of CUSTOMCOMBOBOXS) {
        ListenToThisCombo(combo);
    }
}

export function ListenToThisQuantityContainer(element, callback, {minimum = 1, maximum = 1000000000000000000000000000000000}) {
    const [left, right, text] = ['left', 'right', 'text-input'].map(cls => element.querySelector(`.${cls}`));
    let value = 1;

    text.innerText = value;

    const updateValue = (delta) => {
        const newValue = value + delta;
        if (newValue >= minimum && newValue <= maximum) {
            value = newValue;
            text.innerText = value;
            callback?.(value);
        }
    };

    left.addEventListener("click", () => updateValue(-1));
    right.addEventListener("click", () => updateValue(1));
}

export function ManageQuantityContainers() {
    const ALL = document.querySelectorAll(".quantity-container");

    for (const el of ALL) {
        ListenToThisQuantityContainer(el);
    }
}

function ResetListenerOfCombo(combo) {
    const main = combo.querySelector(".main-content");
    const floating = combo.querySelector(".floating-container");
    const items = floating.querySelectorAll(".item");
    const input = combo.querySelector("input");

    RemoveAllListenerOf(main);
    RemoveAllListenerOf(floating);
    RemoveAllListenerOf(input);

    items.forEach((item) => RemoveAllListenerOf(item));
}

export function ListenToThisCombo(combo, callback = false) {
    const main = combo.querySelector(".main-content");
    const floating = combo.querySelector(".floating-container");
    const items = floating.querySelectorAll(".item");
    const input = combo.querySelector("input");

    let isActive = false;
    let selectedIndex = -1;

    const toggleActive = (active) => {
        isActive = active;
        combo.classList.toggle("show", active);
    };

    const resetItems = () => {
        items.forEach(item => item.classList.remove("hide", "select"));
    };

    const filterItems = (searchText) => {
        const lowerSearch = searchText.toLowerCase();
        items.forEach(item => {
            const shouldShow = item.textContent.toLowerCase().includes(lowerSearch);
            item.classList.toggle("hide", !shouldShow);
        });
    };

    const selectItem = (index) => {
        resetItems();
        const activeItems = Array.from(items).filter(item => !item.classList.contains("hide"));
        if (activeItems[index]) {
            activeItems[index].classList.add("select");
            activeItems[index].scrollIntoView({ block: "nearest", inline: "nearest" });
            input.value = activeItems[index].textContent;
        }
    };

    main.addEventListener("click", () => toggleActive(true));

    items.forEach(item => {
        item.addEventListener("click", () => {
            input.value = item.textContent;
            input.setAttribute("data-value", item.getAttribute("value"));
            toggleActive(false);
            if (callback) {
                callback(item.getAttribute("value"), item.textContent);
            }
        });
    });

    input.addEventListener("input", () => {
        filterItems(input.value);
        selectedIndex = -1;
    });

    input.addEventListener("focus", () => toggleActive(true));

    combo.addEventListener("keydown", (e) => {
        const activeItems = Array.from(items).filter(item => !item.classList.contains("hide"));
        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % activeItems.length;
            selectItem(selectedIndex);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + activeItems.length) % activeItems.length;
            selectItem(selectedIndex);
        } else if (e.key === "Enter" && selectedIndex !== -1) {
            e.preventDefault();
            const selectedItem = activeItems[selectedIndex];
            input.value = selectedItem.textContent;
            input.setAttribute("data-value", selectedItem.getAttribute("value"));
            toggleActive(false);
            if (callback) {
                callback(selectedItem.getAttribute("value"), selectedItem.textContent);
            }
        }
    });

    FNOnClickOutside(combo, () => {
        const new_items = floating.querySelectorAll(".item");

        if (isActive) {
            const matchedItem = Array.from(new_items).find(item => item.textContent.toLowerCase() === input.value.toLowerCase());
            if (matchedItem) {
                input.value = matchedItem.textContent;
                input.setAttribute("data-value", matchedItem.getAttribute("value"));
                if (callback) {
                    callback(matchedItem.getAttribute("value"), matchedItem.textContent);
                }
            } else {
                input.value = "";
                input.removeAttribute("data-value");
                resetItems();
            }
            toggleActive(false);
        }
    }, [floating]);
}

export function ListenToSelect(element, callback) {
    if (element) {
        const selects = element.querySelectorAll(".custom-select");

        for (const select of selects) {
            select.addEventListener("click", () => {
                const radio = select.querySelector("input[type=radio]");

                if (callback) {
                    callback(radio.value);
                }
            });
        }
    }
}

export function ListenToCombo(element, callback) {
    if (element) {
        const input = element.querySelector("input");
        const items = element.querySelectorAll(".item");

        for (const item of items) {
            item.addEventListener("click", () => {
                const span = item.querySelector("span");
                input.value = span.textContent;
                callback && callback(item.getAttribute("value"), span.textContent);
            });
        }
    }
}

export function LinkViewButtonActive(element, path, bool) {
    const links = element.querySelectorAll(".link-view-button");

    for (const link of links) {
        ToggleComponentClass(link, "active", false);
        if (link.getAttribute("data-redirect") === path) {
            ToggleComponentClass(link, "active", bool);
        }
    }
}

export function ManageDisabledLinkRedirect(className, callback) {
    const links = document.querySelectorAll("a" + "." + className);

    for (const link of links) {
        const href = link.getAttribute("href");

        link.addEventListener("click", (e) => {
            e.preventDefault();

            window.history.pushState({}, "", href);

            callback && callback(href);
        });
    }
}

export function ListenToLinkViewButton(element, callback) {
    const links = element.querySelectorAll(".link-view-button");

    const reset = () => {
        for (const link of links) {
            ToggleComponentClass(link, "active", false);
        }
    };

    for (const link of links) {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const href = link.getAttribute("href");
            const path = link.getAttribute("data-redirect") ?? href;

            window.history.pushState({}, "", href);

            callback && callback(path);

            reset();
            ToggleComponentClass(link, "active", true);
        });
    }
}

export function ManageSelects() {
    const SELECTS = document.querySelectorAll(".custom-selects-parent");

    for (const SELECT of SELECTS) {
        const items = SELECT.querySelectorAll(".custom-select");

        const set = (item, bool) => {
            const radio = item.querySelector("input[type=radio]");
            radio.checked = bool;

            if (bool) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        };

        const reset = () => {
            for (const item of items) {
                set(item, false);
            }
        };

        const setActive = (index) => {
            reset();
            set(items[index], true);
        };

        if (IsNodeList(items)) {
            const searchActive = [...Array(items.length)]
                .map((_, i) => i)
                .filter((_, i) => items[i].classList.contains("active"));

            const active = searchActive.length ? searchActive[0] : -1;

            setActive(active);
        }

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("click", () => setActive(i));
        }
    }
}

export function GetDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

export const Range = (min, max) => {
    return Array.from({length: max - min + 1}, (_, i) => min + i);
};

export function RemoveAllListenerOf(element) {
    const new_element = element.cloneNode(true);
    element.parentNode.replaceChild(new_element, element);

    return new_element;
}

export function RemoveListener(element, event, listener) {
    element.removeEventListener(event, listener);
}

export function ToggleComponentClass(element, className, bool) {
    if (!element) return;

    if (bool) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

export function HideShowComponent(element, bool, flex = true) {
    if (!element) return
    if (bool) {
        element.classList.remove("hide-component");
        if (flex) {
            element.classList.add("show-component");
        } else {
            element.classList.add("show-component-not-flex");
        }
    } else {
        element.classList.add("hide-component");
        if (flex) {
            element.classList.remove("show-component");
        } else {
            element.classList.remove("show-component-not-flex");
        }
    }
}

export function UUIDV4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

export function GetLocationPathFromIndex(
    start,
    end,
    path = window.location.pathname
) {
    return path.split("/").slice(start, end).join("/").toString();
}

export function IsOutOfViewport(elem) {
    const bounding = elem.getBoundingClientRect();
    const out = {};

    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom =
        bounding.bottom >
        (window.innerHeight || document.documentElement.clientHeight);
    out.right =
        bounding.right >
        (window.innerWidth || document.documentElement.clientWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;

    return out;
}

export function ManageGrowWrap() {
    const growers = document.querySelectorAll(".grow-wrap");

    growers.forEach((grower) => {
        const textarea = grower.querySelector("textarea");
        let value = null;

        textarea.addEventListener("input", () => {
            const growUntil = textarea.getAttribute("data-grow-until");
            // const bool = growUntil && grower.clientHeight <= parseInt(growUntil);

            grower.dataset.replicatedValue = textarea.value;
        });
    });
}

export function IsOverflowing({
                                  clientWidth,
                                  clientHeight,
                                  scrollWidth,
                                  scrollHeight,
                              }) {
    return scrollHeight > clientHeight || scrollWidth > clientWidth;
}

export function ExecuteFn(listeners, listener, ...args) {
    if (
        listener &&
        listeners[listener] &&
        typeof listeners[listener] === "function"
    ) {
        listeners[listener](...args);
    }
}

export function TextareaSubmitListener(textarea, listeners = {}) {
    if (!textarea) return;
    textarea.addEventListener("keydown", function (e) {
        const keyCode = e.which || e.keyCode;

        if (keyCode === 13 && !e.shiftKey) {
            // Don't generate a new line
            e.preventDefault();
            ExecuteFn(listeners, "onEnter", textarea.value);
        } else if (keyCode === 13 && e.shiftKey) {
            ExecuteFn(listeners, "onBreakLine", textarea.value);
        }
    });

    textarea.addEventListener("input", () => {
        ExecuteFn(listeners, "onInput", textarea.value);
    });

    textarea.addEventListener("change", () => {
        ExecuteFn(listeners, "onChange", textarea.value);
    });
}

export function CountTextareaLines(textarea) {
    const text = textarea.value;
    const lines = text.split("\n");
    return lines.length;
}

export function InsertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        let sel;
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == "0") {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value =
            myField.value.substring(0, startPos) +
            myValue +
            myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

export function OnScrollToBottom(callback) {
    window.onscroll = function (ev) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            callback && callback();
        }
    };
}

export function ElOnScrollToTop(element, callback) {
    if (!element) return;
    element.onscroll = function (ev) {
        if (element.scrollTop === 0) {
            callback && callback();
        }
    };
}

export function ElOnScrollToBottom(element, callback) {
    if (!element) return;
    element.addEventListener("scroll", function (event) {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            callback && callback();
        }
    });
}

export function ScrollManager(bool) {
    const keys = {37: 1, 38: 1, 39: 1, 40: 1};

    const preventDefault = (e) => {
        e.preventDefault();
    };

    const preventDefaultForScrollKeys = (e) => {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    };

    let supportsPassive = false;

    try {
        window.addEventListener(
            "test",
            null,
            Object.defineProperty({}, "passive", {
                get: function () {
                    supportsPassive = true;
                },
            })
        );
    } catch (e) {
    }

    const wheelOpt = supportsPassive ? {passive: false} : false;
    const wheelEvent =
        "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

    function DisableScroll() {
        window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
        // window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
        window.addEventListener("keydown", preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function EnableScroll() {
        window.removeEventListener("DOMMouseScroll", preventDefault, false);
        // window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
        window.removeEventListener("touchmove", preventDefault, wheelOpt);
        window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
    }

    bool ? EnableScroll() : DisableScroll;
}

export function EnableDisableInput(input, bool) {
    ToggleComponentClass(input, "button-disabled", bool);

    if (bool) {
        addAttr(input, "disabled", "true");
    } else {
        input.removeAttribute("disabled");
    }
}

export function EnableDisableButton(button, bool) {
    ToggleComponentClass(button, "button-disabled", bool);

    if (bool) {
        addAttr(button, "disabled", "true");
    } else {
        button.removeAttribute("disabled");
    }
}

export function PreventScroll(e) {
    e.preventDefault();
    e.stopPropagation();

    return false;
}

export function DisableScroll() {
    document.body.style.overflow = "hidden";
}

export function EnableScroll() {
    document.body.style.overflow = "auto";
}

export function UseImageMiniIcon(name, x, y, width, height, extension = "png") {
    const src = "public/assets/media/mini-icons/" + name + "." + extension;

    return CreateElement({
        el: "i",
        attr: {
            dataVisualcompletion: "css-img",
        },
        styles: {
            width: `${width}px`,
            height: `${height}px`,
            backgroundPosition: `${x}px ${y}px`,
            backgroundImage: `url("${src}")`,
            backgroundSize: `auto`,
            backgroundRepeat: "no-repeat",
        },
    });
}

export function SortArrLowToHigh(array) {
    array.sort(function (a, b) {
        if (a === Infinity) return 1;
        else if (isNaN(a)) return -1;
        else return a + b;
    });

    return array;
}

export function CreateIllustrationInfoContainer(obj) {
    const {illustration, primary, secondary, buttons = []} = obj;
    const path = "/public/assets/media/images/illustrations/";

    const createButton = (btn) => {
        const {text, icon, action, classes = []} = btn;
        const childs = [];

        if (icon) {
            childs.push(
                CreateElement({
                    el: "DIV",
                    className: "icon",
                    child: CreateElement({
                        el: "IMG",
                        attr: {
                            src: icon,
                        },
                    }),
                })
            );
        }

        return CreateElement({
            el: "DIV",
            classes: ["icon-button", ...classes],
            childs: [
                ...childs,
                CreateElement({
                    el: "DIV",
                    className: "text",
                    child: CreateElement({
                        el: "SPAN",
                        text: text,
                    }),
                }),
            ],
            listener: {
                click: () => action && action(),
            },
        });
    };

    return CreateElement({
        el: "DIV",
        className: "illustration-info-container",
        childs: [
            CreateElement({
                el: "DIV",
                className: "illustration",
                child: CreateElement({
                    el: "IMG",
                    attr: {
                        src: `${path}${illustration}`,
                    },
                }),
            }),
            CreateElement({
                el: "DIV",
                className: "body",
                childs: [
                    CreateElement({
                        el: "DIV",
                        className: "top",
                        childs: [
                            CreateElement({
                                el: "h1",
                                text: primary,
                            }),
                            CreateElement({
                                el: "p",
                                text: secondary,
                            }),
                        ],
                    }),
                    CreateElement({
                        el: "DIV",
                        className: "bot",
                        child: CreateElement({
                            el: "DIV",
                            className: "buttons",
                            child: !buttons.length
                                ? []
                                : buttons.map((btn) => createButton(btn)),
                        }),
                    }),
                ],
            }),
        ],
    });
}

export function Ltrim(str) {
    if (!str) return str;
    return str.replace(/^\s+/g, "");
}

export function GetURLParRange(parent, uri, until) {
    const path = uri.split("/").map((a) => a.trim());
    const isTheSame = path.length === 2 && path[0] === path[1];
    const last = path.lastIndexOf(parent);

    return isTheSame
        ? path.join("/").toString()
        : path
            .slice(last, last + 2)
            .join("/")
            .toString();
}

export function ReformatURI(uri) {
    return uri.replaceAll("//", "/");
}

//
// export function MakeID(length) {
//     var result = "";
//     var characters =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     var charactersLength = characters.length;
//     for (var i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }

export function ListenToForm(form, callback, excepts = [], options = []) {
    const clearBtn = form.querySelector(".clear-form");
    const getAllFields = () => {
        const input = [...form.querySelectorAll("input")].filter(i => !i.classList.contains("table-checkbox"));
        const disabledInputWhereCounts = [...form.querySelectorAll("input[stillcount=true]")]
        const textarea = form.querySelectorAll("textarea");
        const combos = form.querySelectorAll(".custom-combo-box");

        if (disabledInputWhereCounts.length) {
            for(const i of disabledInputWhereCounts) {
                input.push(i);
            }
        }

        return {input, textarea, combos};
    }

    const disableButton = (btn, bool) => {
        if (btn) {
            const parent = btn.parentNode;

            EnableDisableButton(btn, bool);

            if (parent.classList.contains('form-group')) {
                EnableDisableButton(parent, bool);
            }
        }
    }

    const check = (ignore = false, recheck = false) => {
        const formdata = new FormData(form);
        const data = Object.fromEntries(formdata);
        const verify = VerifyFormData(formdata, excepts, options);
        const button = form.querySelector("input[type=submit]");

        if (button) {
            disableButton(button, true);
        }

        if (!verify.status) {
            if (!ignore) {
                ApplyError(verify.empty, form);
            }

            disableButton(button, true);
        } else {

            if (!ignore) {
                callback && callback(data);
            } else {
                disableButton(button, false);
            }
        }

        if (recheck) {
            checkGood(true);
        }
    }

    const checkGood = (recheck = false) => {
        const fields = getAllFields();

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                for (const input of fields.input) {
                    if (input.type !== "submit") {
                        input.value = null
                    }
                }
                for (const textarea of fields.textarea) textarea.value = null;

                check(true)
            })
        }

        for (const input of fields.input) {
            input.addEventListener("input", () => {
                if (input.type !== 'submit') {
                    check(true);
                }
            });
            input.addEventListener("input", () => {
                if (input.type !== 'submit') {
                    check(true);
                }
            });

            input.addEventListener("blur", () => {
                if (input.type !== 'submit') {
                    check(true);
                }
            });
        }

        for (const textarea of fields.textarea) {
            textarea.addEventListener("change", () => check(true));
        }

        for (const combo of fields.combos) {
            ListenToCombo(combo, () => check(true))
        }


        if (!recheck) {
            form.addEventListener("submit", (e) => {
                e.preventDefault()
                check();
            })
        }

        check(true);
    }

    checkGood();

    return check;
}

export function RemoveToCircularList(element, value, callback) {
    const items = element.querySelectorAll(".circle-item[role=item]");

    for (const item of items) {
        if (item.getAttribute("data-value") === value) {
            item.remove();
            callback && callback(value);
        }
    }
}

export function AddToCircularList(element, items, onRemove) {
    const createItem = ({text, value}) => {
        return CreateElement({
            el: "DIV",
            className: "circle-item",
            attr: {
                role: "item",
                ["data-value"]: value
            },
            text: text,
            listener: {
                click: () => {
                    RemoveToCircularList(element, value);
                    onRemove && onRemove(value, text);
                }
            }
        })
    }

    const elements = [...new Array(items.length)].map((_, i) => createItem(items[i]));

    prepend(element, elements);

}

export function ListenToCircularList(element, currentData = [], listeners = {}, replace = false) {
    const button = element.querySelector(".circle-item[role=button]");

    button.addEventListener("click", () => {
        ExecuteFn(listeners, "onAdd");
    });

    if (currentData.length) {

        if (replace) {
            currentData.forEach((item) => RemoveToCircularList(element, item.value));
        }

        AddToCircularList(element, currentData, (item) => {
            ExecuteFn(listeners, "onRemove", item);
        });
    }
}

export function GetCircularListValues(element) {
    const items = element.querySelectorAll(".circle-item[role=item]");
    return [...new Array(items.length)].map((_, i) => {
        return {
            value: items[i].getAttribute('data-value'),
            text: items[i].textContent
        }
    })
}

export function GetNumsOfYear(y, m) {
    return new Date(y, m, 0).getDate()
}

export function CreateCheckBox() {
    return CreateElement({
        el: "DIV",
        className: "custom-checkbox-parent",
        childs: [
            CreateElement({
                el: "DIV",
                className: "circle"
            }),
            CreateElement({
                el: "DIV",
                className: "custom-checkbox",
                childs: [
                    CreateElement({
                        el: "INPUT",
                        className: "table-checkbox",
                        attr: {
                            type: "checkbox"
                        }
                    }),
                    CreateElement({
                        el: "SPAN",
                        className: "checkmark"
                    })
                ]
            })
        ]
    })
}

export function SetEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    {
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}


export function ListenToThisAccordion(accordion) {
    const items = accordion.querySelectorAll(".item");

    for (const item of items) {
        const head = item.querySelector(".head");

        if (head) {
            head.addEventListener("click", function () {
                ToggleComponentClass(item, "active", !item.classList.contains("active"))
            })
        }
    }
}

export function ManageAccordions()  {
    const accordions = document.querySelectorAll(".custom-accordion");

    for (const accordion of accordions) {
        ListenToThisAccordion(accordion);
    }
}

export function ListenToYearAndPeriodAsOptions(year_and_period, callback, includes = []) {
    const options = {
        year: null,
        period: null
    };

    if (includes.length) {
        includes.forEach((i) => options[i] = null);
    }

    const year = year_and_period.querySelector(".year");
    const period = year_and_period.querySelector(".period");

    const dooCallback = () => {
        if (options.year === null) {
            delete options.year;
        }

        if (options.period === null) {
            delete options.period;
        }

        includes.forEach((i) => {
            if (options[i] == null) {
                delete options[i];
            }
        })

        callback(options);
    }

    ListenToThisCombo(year, function (_, y) {
        SetNewComboItems(period, GetPeriodOfAYear(y));

        options.year = y;

        dooCallback();

        ListenToThisCombo(period, function (_, p) {
            options.period = p;

            dooCallback();

        })
    })

    includes.forEach((item) => {
        const elem = year_and_period.querySelector("." + item);

        ListenToThisCombo(elem, function (_, y) {
            options[item] = _;

            dooCallback();
        })
    })
}

export function ChunkArray(array, size) {
    return array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index/size);

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, [])
}


export function CreateComboBox(name, placeholder, items, options = {firstval: false, initial: null, disabled: false, small: false}) {
    const value = options.initial ? (!Array.isArray(options.initial) ? options.initial : options.initial.text) : (options.firstval && items.length > 0 ? items[0].text : "");
    const defValue = options.initial ? (!Array.isArray(options.initial) ? options.initial : options.initial.value) : (options.firstval && items.length > 0 ? items[0].value : "");

    const comboBox = CreateElement({
        el: 'div',
        className: [`custom-combo-box`, name, options.small ? 'small' : ''],
        childs: [
            CreateElement({
                el: 'div',
                className: 'main-content',
                childs: [
                    CreateElement({
                        el: 'input',
                        attr: {
                            type: 'text',
                            value: value,
                            name: name,
                            placeholder: placeholder,
                            autocomplete: 'off',
                            'data-value': defValue,
                            disabled: options.disabled ? 'disabled' : null
                        }
                    }),
                    CreateElement({
                        el: 'div',
                        className: 'icon',
                        child: CreateElement({
                            el: 'svg',
                            attr: {
                                width: '16px',
                                height: '16px',
                                viewBox: '0 0 256 256',
                                id: 'Flat',
                                xmlns: 'http://www.w3.org/2000/svg'
                            },
                            child: CreateElement({
                                el: 'path',
                                attr: {
                                    d: 'M128,180a3.98881,3.98881,0,0,1-2.82861-1.17139l-80-80.00024a4.00009,4.00009,0,0,1,5.65722-5.65674L128,170.34326l77.17139-77.17163a4.00009,4.00009,0,0,1,5.65722,5.65674l-80,80.00024A3.98881,3.98881,0,0,1,128,180Z'
                                }
                            })
                        })
                    })
                ]
            }),
            CreateElement({
                el: 'div',
                className: 'floating-container',
                childs: items.map(item => {
                    const itemValue = typeof item === 'object' ? item.value : item;
                    const itemText = typeof item === 'object' ? item.text : item;
                    return CreateElement({
                        el: 'div',
                        className: 'item',
                        attr: { value: itemValue },
                        child: CreateElement({
                            el: 'span',
                            text: itemText
                        })
                    });
                })
            })
        ]
    });

    return comboBox;
}