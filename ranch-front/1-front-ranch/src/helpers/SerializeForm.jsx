export const SerializeForm = (form) => {

    const formData = new FormData(form);

    const completeObj = {};

    console.log(formData);
    for(let [name, value] of formData){
        console.log(name, value)
    }

}