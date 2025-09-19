feather.replace();

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function setStatus(target, status, icon) {
    target.setAttribute("disabled", true);
    switch (status) {
        case "loading":
            if (!!icon) {
                target.replaceChildren(icon);
                feather.replace();
            } else {
                target.classList.add(status);
            }
            break;
        case "error":
            if (!!icon) {
                target.replaceChildren(icon);
                feather.replace();
            }
            target.classList.add(status);
            setTimeout(function () {
                target.classList.remove(status);
                target.removeAttribute("disabled");
            }, 1500);
            break;
        case "success":
            if (!!icon) {
                target.replaceChildren(icon);
                feather.replace();
            }
            target.classList.add(status);
            setTimeout(function () {
                target.classList.remove(status);
                target.removeAttribute("disabled");
            }, 500);
            break;
        default:
            break;
    }
}

function textareaAutoGrow(e) {
    e.target.style.height = "initial";
    e.target.style.height = e.target.scrollHeight + "px";
}

function closePopup() {
    document.querySelector("div.popup")?.remove();
}

function showPopup(title, message, options, content) {
    let defaultOptions = [
        {
            title: "Conferma",
            action: "closePopup()",
        },
    ];

    if (!!options && Array.isArray(options)) {
        defaultOptions = defaultOptions.concat(options);
    }

    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <dialog class="dialog" open>
          <h3>${title || "Popup"}</h3>
            <p>${message || "Insert a message."}</p>
          <form method="dialog">
            ${content || ""}
            <div class="dialog-options">
              <button class="dialog-cancel transparent" type="reset" onclick="closePopup()">Annulla</button>
              ${defaultOptions
                  .map((o) => `<button class="opaque" type="reset" onclick="${o.action}">${o.title}</button>`)
                  .join()
                  .trim()}
            </div>
          </form>
          <button class="dialog-close transparent" onclick="closePopup()">
            <i data-feather="x"></i>
          </button>
        </dialog>
    `;

    document.body.appendChild(popup);
    feather.replace();
}

window.addEventListener("load", function () {
    if (!!this.document && this.document.isConnected) {
        const chat = this.document.getElementById("chat");
        const upload = this.document.getElementById("upload");
        const filesInput = document.querySelector("button#upload>input");
        const files = this.document.getElementById("files");
        const message = this.document.getElementById("message");
        const submit = this.document.getElementById("submit");

        const arrowUp = this.document.createElement("i");
        arrowUp.setAttribute("data-feather", "arrow-up");
        const loader = this.document.createElement("i");
        loader.setAttribute("data-feather", "loader");

        message.addEventListener("input", textareaAutoGrow);
        message.addEventListener("cancel", textareaAutoGrow);
        message.addEventListener("focus", function (e) {
            e.target.select();
        });
        message.addEventListener("keyup", function (e) {
            const isDisabled = submit.getAttribute("disabled");
            if (!isDisabled && (!e.target.value.length || e.target.value.length < 4)) {
                submit.setAttribute("disabled", true);
            } else if (!!isDisabled && e.target.value.length > 3) {
                submit.removeAttribute("disabled");
            }
        });

        upload?.addEventListener("click", function () {
            filesInput.click();
        });

        filesInput.addEventListener("change", function (e) {
            console.log(files.files);
            if (!!e.target.files.length) {
                files.style.padding = "0.25rem";
                for (let i = 0; i < e.target.files.length; ++i) {
                    const currFile = e.target.files[i];

                    // if (Array.from(files.files).some((f) => f.name === currFile.name && f.size === currFile.size)) {
                    // }

                    console.log("File %d: %o", i, currFile);
                    const f = document.createElement("span");
                    f.innerHTML = `<i data-feather="file"></i> ${currFile.name} <i data-feather="x"></i>`;
                    files.appendChild(f);
                }
                feather.replace();
            }
        });

        submit?.addEventListener("click", async function () {
            const text = message?.value || "";

            if (text?.length < 4 || !text.match("^[a-zA-Z0-9]*$")) {
                return setStatus(submit, "error", arrowUp);
            }

            setStatus(submit, "loading", loader);

            await sleep(3000);
            // return setStatus(submit, "success", arrowUp);

            try {
                const res = await fetch(`http://127.0.0.1:4000/chat?mex=${encodeURI(text)}`);
                setStatus(submit, "success", arrowUp);

                const tag = "</think>";
                const rtext = await res.text();
                let t = rtext.slice(rtext.indexOf(tag) + tag.length + 1, rtext?.length);

                let toggle = false;
                while (t.includes("**")) {
                    t = t.replace("**", !toggle ? "<strong>" : "</strong>");
                    toggle = !toggle;
                }

                const p = document.createElement("p");
                p.innerHTML = t;
                chat.appendChild(p);
            } catch (err) {
                console.error(err);
                setStatus(submit, "error", arrowUp);
            }
        });
    }
});
