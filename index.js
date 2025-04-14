// Booster session
const readline = require('node:readline');
const fs = require('node:fs').promises;
const path = require('node:path');
const { exit } = require('node:process');

const filePath = path.join(__dirname, 'tasks.txt');




const getInput = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
            rl.close();
        });
    });
}
const addTask = async () => {
    try {
        const task = await getInput('Enter the task: ');
        try {
            await fs.access(filePath);
            const fileContent = await fs.readFile(filePath, 'utf-8');

            if (fileContent.trim() === '') {
                await fs.writeFile(filePath, task);
            }
            else {
                await fs.appendFile(filePath, '\n' + task);
            }
        }
        catch (error) {
            // console.log('Error writing to file:', error);
            await fs.writeFile(filePath, task);
        }
    } catch (error) {
    }
}

const viewFile = async () => {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return data.split('\n');
    }
    catch (error) {
        console.error("File doesn't exist create a new one: ", error);
        return [];
    }
}

async function deleteTask() {
    const taskIndex = await getInput('Enter the task number to delete: ');
    try{
        const data = await viewFile();
        if (data.length > 0) {
            if (taskIndex > 0 && taskIndex < data.length) {
                const updatedTasks = data.filter((_, index) => index !== taskIndex - 1);
                await fs.writeFile(filePath, updatedTasks.join('\n'));
                console.log('Task deleted successfully!');
            } else {
                console.log('Invalid task number!');
            }
        } else {
            console.log('No tasks to delete!');
        }
    }
    catch(error) {
        console.error("Error deleting task: ", error);
    }
}

async function markTaskAsDone() {
    const taskIndex = await getInput('Enter the task number to mark as done: ');
    try {
        const data = await viewFile();
        if (data.length > 0) {
            if (taskIndex > 0 && taskIndex < data.length) {
                data[taskIndex - 1] = `${data[taskIndex - 1]} [Done]`;
                await fs.writeFile(filePath, data.join('\n'));
                console.log('Task marked as done!');
            } else {
                console.log('Invalid task number!');
            }
        } else {
            console.log('No tasks to mark as done!');
        }
    } catch (error) {
        console.error("Error marking task as done: ", error);
    }
}
async function main() {
    while (true) {
        console.log('\n1. Add a new task');
        console.log('2. View all tasks');
        console.log('3. Mark task as done');
        console.log('4. Remove a task');
        console.log('5. Exit');

        const choice = await getInput('Enter your choice: ');
        switch (choice) {
            case '1':
                await addTask();
                break;
                console.log(choice);
            case '2':
                const data = await viewFile();
                if (data.length > 0) {
                    console.log('Tasks:');
                    data.forEach((task, index) => {
                        console.log(`${index + 1}. ${task}`);
                    });
                }
                else {
                    console.log('No tasks found!');
                }
                break;
            case '3':
                await markTaskAsDone();
                break;
            case '4':
               await deleteTask();
            case '5':
                exit();

            default:
                console.log('please enter a valid choice');

        }
    }
}
main();


