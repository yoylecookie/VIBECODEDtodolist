        const form = document.getElementById("add-form");
        const input = document.getElementById("task-input");
        const list = document.getElementById("tasks");
        const count = document.getElementById("task-count");

        const STORAGE_KEY = "little-list-tasks";
        let tasks = [];

        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (
                Array.isArray(saved) &&
                saved.every(task =>
                    task &&
                    typeof task.text === "string" &&
                    typeof task.done === "boolean"
                )
            ) {
                tasks = saved;
            }
        } catch {
            tasks = [];
        }

        function saveTasks() {
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(tasks)
                );
            } catch {
                // The list still works if browser storage is unavailable.
            }
        }

        function renderTasks() {
            list.replaceChildren();

            count.textContent =
                `${tasks.length} ${tasks.length === 1 ? "item" : "items"}`;

            tasks.forEach((task, index) => {
                const row = document.createElement("li");
                row.className = "task";

                if (task.done) {
                    row.classList.add("completed");
                }

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "task-checkbox";
                checkbox.checked = task.done;
                checkbox.setAttribute(
                    "aria-label",
                    `Mark ${task.text} as ${task.done ? "incomplete" : "complete"}`
                );

                checkbox.addEventListener("change", () => {
                    tasks[index].done = checkbox.checked;
                    saveTasks();
                    renderTasks();
                });

                const label = document.createElement("span");
                label.className = "task-text";
                label.textContent = task.text;

                row.append(checkbox, label);
                list.appendChild(row);
            });
        }

        form.addEventListener("submit", event => {
            event.preventDefault();

            const text = input.value.trim();
            if (!text) return;

            tasks.push({
                text,
                done: false
            });

            saveTasks();
            renderTasks();

            input.value = "";
            input.focus();
        });

        renderTasks();
