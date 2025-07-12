// Add Set To exercise
const exerciseRow = document.getElementById('exercise-row');
const addSetButton = exerciseRow.querySelector('.add-set');

addSetButton.addEventListener('click', () => {
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.placeholder = 'Weight';
    weightInput.className = 'set-input';
    
    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.placeholder = 'Reps';
    repsInput.className = 'set-input';            
    
    exerciseRow.insertBefore(weightInput, addSetButton);
    exerciseRow.insertBefore(repsInput, addSetButton);
});

// Remove Set From exercise
const removeSetButton = exerciseRow.querySelector('.remove-set');

removeSetButton.addEventListener('click', () => {
    const inputs = exerciseRow.querySelectorAll('input');

    if (inputs.length > 3) {
        exerciseRow.removeChild(inputs[inputs.length -1]);
        exerciseRow.removeChild(inputs[inputs.length -2]);
    }
});   

// Add/remove exercise row
const exercises = document.getElementById('exercise-container');
const addExerciseBtn = document.getElementById('add-ex');
const removeExerciseBtn = document.getElementById('remove-ex');

function createExerciseRow() {
    const row = document.createElement('div');
    row.className = 'exercise-row';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'exercise-name';
    nameInput.placeholder = 'e.g. squat';
    
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.className = 'set-input';
    weightInput.placeholder = 'Weight';
    

    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.className = 'set-input';
    repsInput.placeholder = 'Reps';


    const addSetBtn = document.createElement('button');
    addSetBtn.className = 'add-set';
    addSetBtn.textContent = '+';   

    addSetBtn.addEventListener('click', () => {
        const weight = document.createElement('input');
        weight.type = 'number';
        weight.className = 'set-input';
        weight.placeholder = 'Weight';
        
        const reps = document.createElement('input');
        reps.type = 'number';
        reps.className = 'set-input';
        reps.placeholder = 'Reps';  

        row.insertBefore(weight, addSetBtn);
        row.insertBefore(reps, addSetBtn);
    });

    const removeSetBtn = document.createElement('button');
    removeSetBtn.className='remove-set';
    removeSetBtn.textContent = '-';
    
    removeSetBtn.addEventListener('click', () => {
        const inputs = row.querySelectorAll('input');
        if (inputs.length > 3) {
            row.removeChild(inputs[inputs.length - 1]);
            row.removeChild(inputs[inputs.length - 2]);
        }
    }); 

    row.appendChild(nameInput);
    row.appendChild(weightInput);
    row.appendChild(repsInput);
    row.appendChild(addSetBtn);
    row.appendChild(removeSetBtn);

    return row;       
}          

addExerciseBtn.addEventListener('click', () => {
    const newRow = createExerciseRow();
    exercises.appendChild(newRow);
});

// Remove Exercise Button (removes the last one)
removeExerciseBtn.addEventListener('click', () => {
    const allRows = exercises.querySelectorAll('.exercise-row');
    if (allRows.length > 1) {
    exercises.removeChild(allRows[allRows.length - 1]);
    }
});

// Save Session
const saveButton = document.getElementById('save-session');

saveButton.addEventListener('click', () => {
    const dateInput = document.getElementById('date-entry');
    const theDate = dateInput.value;
    
    const jsonExercises = [];    
    const allRows = exercises.querySelectorAll('.exercise-row');
    for (let i = 0; i < allRows.length; i++){
        const thisRow = allRows[i];
        const thisEx = thisRow.querySelectorAll('.exercise-name');
        const exName = thisEx[0].value;
        const jsonSets = [];
        
        const allSets = thisRow.querySelectorAll('.set-input');
        for (let i2 = 0; i2 < (allSets.length)/2; i2++){
            const weightVal = allSets[i2*2].value;
            const repsVal = allSets[(i2*2)+1].value;                    
            if (weightVal > 0 || repsVal > 0){
                jsonSets.push({weight:weightVal,reps:repsVal});
            }
        }
        
        jsonExercises.push({exercise:exName, sets:jsonSets});
    }
    
    const jsonSession = {date:theDate, exercises:jsonExercises}
    
    localStorage.setItem("session", JSON.stringify(jsonSession));         
    location.reload();

});

// output saved data
const debugButton = document.getElementById('debug');
debugButton.addEventListener('click', () => {
    const data = JSON.parse(localStorage.getItem("session"));
    console.log(data);
});