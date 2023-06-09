import { handleHttpErrors,sanitizeStringWithTableRows } from "../../utils.js"
import { API_URL,getHeaders } from "../../settings.js"

let URL = API_URL+"/cinema/"

let headers = getHeaders()



export async function initEditCinema(){
    if (localStorage.token == null) {
        document.getElementById("error-text").innerText = 'You must be logged in to access this feature'
    }else{
    document.getElementById("tbody").onclick=buttons
    try {
        const cinema = await fetch(URL+"edit",{
            headers:headers
        }).then(handleHttpErrors)
        renderCinema(cinema)
    } catch (error) {
        document.getElementById("error-text").innerText = error      
    }
}
}

function renderCinema(cinema){
let tableRows = cinema.map(c=>`
<tr id="cinema-row-${c.id}">
<td><input id="cinema-name${c.id}" type="text" value="${c.name}"></td>
<td><input id="cinema-description${c.id}" type="text" value="${c.description}"></td>
<td><input id="cinema-street${c.id}" type="text" value="${c.street}"></td>
<td><input id="cinema-city${c.id}" type="text" value="${c.city}"></td>
<td><input id="cinema-zip${c.id}" type="text" value="${c.zip}"></td>
<td><button id="btn_edit_${c.id}" type="button" class="btn btn-primary">Save changes</button></td>
<td><button id="btn_delete_${c.id}" type="button" class="btn btn-warning">Delete cinema</button></td>
<td><button id="btn_showing_${c.id}" type="button" class="btn btn-secondary">Add Showing</button></td>
</tr>`).join("")

document.getElementById("tbody").innerHTML=tableRows
}

async function buttons(evt){
const target = evt.target

headers.set("content-type","application/json")

if(!evt.target.id.startsWith("btn")){
    return
}
const parts = target.id.split("_")
const action = parts[1]
const id = parts[2]

switch (action) {
    case "edit":
        editCinema(id)
        break;
    case "delete":
        deleteCinema(id)
        break;
    case "showing":
        window.router.navigate(`/create-showing?cinemaid=${id}`)
    
}


}

async function editCinema(id){
    let edittedCinema = {}
    edittedCinema.name=document.getElementById("cinema-name"+id).value
    edittedCinema.description=document.getElementById("cinema-description"+id).value
    edittedCinema.street=document.getElementById("cinema-street"+id).value
    edittedCinema.city=document.getElementById("cinema-city"+id).value
    edittedCinema.zip=document.getElementById("cinema-zip"+id).value
    try {
         await fetch(URL+id,{
            headers: headers,
            method:"PUT",
            body: JSON.stringify(edittedCinema)
        })
    } catch (error) {
        console.log(error)
    }
}

async function deleteCinema(id){
    try {
        await fetch(URL+id,{
           headers: headers,
           method:"DELETE"
       })
   } catch (error) {
       console.log(error)
   }
}


