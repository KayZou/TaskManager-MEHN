const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')
// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible';
  try {
    const response = await fetch('/api/v1/tasks/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { tasks } = await response.json();

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
    } else {
      const allTasks = tasks
        .map((task) => {
          const { completed, _id: taskID, name } = task;
          return `<div class="single-task ${completed && 'task-completed'}">
            <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
            <div class="task-links">
              <a href="task.html?id=${taskID}" class="edit-link">
                <i class="fas fa-edit"></i>
              </a>
              <button type="button" class="delete-btn" data-id="${taskID}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>`;
        })
        .join('');
      tasksDOM.innerHTML = allTasks;
    }
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
      console.log(error);
  } finally {
    loadingDOM.style.visibility = 'hidden';
  }
};


showTasks()

// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showTasks();
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.log(error);
    } finally {
      loadingDOM.style.visibility = 'hidden';
    }
  }
});


// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;

  try {
    const response = await fetch('http://localhost:4000/api/v1/tasks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      showTasks();
      taskInputDOM.value = '';
      formAlertDOM.textContent = 'Success, task added';
      formAlertDOM.classList.add('text-success');
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    formAlertDOM.textContent = 'Error, please try again';
    console.log(error.message);
  } finally {
    formAlertDOM.style.display = 'block';
    setTimeout(() => {
      formAlertDOM.style.display = 'none';
      formAlertDOM.classList.remove('text-success');
    }, 3000);
  }
});

