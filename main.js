import init, {csv} from "/csv.js";

function $(html){
	return document.getElementById(html);
}

async function get_file(file){
	let file_contents = "";
	await fetch(file)
		.then(response => {
			if (!response.ok){
				return "";
			}
			return response.text()
		})
		.then(data =>{
			file_contents = data;
		})
	return file_contents;
}

async function csvfn(string){
	await init();
	let output = await csv(string);
	return output;
}
function contains(str, chr){
	for (let i =0; i < str.length; i++){
		if (str[i] == chr){
			return true;
		}
	}
	return false;
}

let file_conts = await get_file("/data/pl.csv");
let vec = await csvfn(file_conts);
let index = Math.floor(Math.random() * 5500);
// Const's declaration
let won = false;
const ANSWER = vec[index];
const KEYBOARD_ELEMENT = $("keyboard");
const ANSWER_ELEMENT = $("answer");
const ROWS = [$("r1"), $("r2"), $("r3"), $("r4"), $("r5"), $("r6")];
// Start
let currently_sellected;
set_currentlypressed();

const VALID_KEYS = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZąĄęńŃĘÓółŁćĆźŹżŻśŚ"];
const SPECIAL_KEYS = { Backspace: "backspace", Enter: "enter" };

for (let i = 0; i < KEYBOARD_ELEMENT.childElementCount; i++){
	const ROW = KEYBOARD_ELEMENT.children[i];
	for (let j = 0; j < ROW.childElementCount; j++){
		const BUTTON = ROW.children[j];
		BUTTON.addEventListener("click", () => {
			handle_keypress(BUTTON.innerHTML);
		});
	}
}

function set_currentlypressed(){
	let previous_state = currently_sellected;
	for (let i = 0; i < ROWS.length; i++){
		if (ROWS[i].className != "done"){
			currently_sellected = ROWS[i];
			break;
		}
	}
	if (previous_state == currently_sellected){
		if (won != true){
			$("msg").innerHTML = "Przegrałeś, prawidłową odpowiedzią jest: " + ANSWER;
			$("retry").className = "";
		}
	}
}
if(navigator.platform.toLowerCase() != "android"|"ios"){
document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (!won&&VALID_KEYS.includes(key) || SPECIAL_KEYS[key]) {
        handle_keypress(key);
    }
});
}

export function handle_keypress(key) {
    if (key==="Bac"||key === "Backspace" && !won) {
        remove_last_character();
    } else if (key === "Ent"||key === "Enter" && !won) {
        if (check_all()) {
            handle_enter();
        }
    } else if (VALID_KEYS.includes(key) && !won) {
        insert_character(key);
    }
}

function remove_last_character() {
    for (let i = currently_sellected.childElementCount - 1; i >= 0; i--) {
        const cell = currently_sellected.children[i];
        if (cell.innerHTML !== "") {
            cell.innerHTML = "";
            break;
        }
    }
}

function insert_character(key) {
    for (let i = 0; i < currently_sellected.childElementCount; i++) {
        const cell = currently_sellected.children[i];
        if (cell.innerHTML === "") {
            cell.innerHTML = key;
            break;
        }
    }
}
function handle_enter(){
	currently_sellected.className = "done";
	check_password();
	set_currentlypressed();
}
function check_password(){
	let input = "";
	for (let i = 0; i < currently_sellected.childElementCount; i++){
		input += currently_sellected.children[i].innerHTML;
	}
	for (let j = 0; j < input.length; j++){
		console.log(input[j]);
		if (input[j] == ANSWER[j]){
			currently_sellected.children[j].className="correct";
		}
		else if (contains(ANSWER, input[j])){
			currently_sellected.children[j].className = "placed";
		}
		else if (!contains(ANSWER, input[j])){
			currently_sellected.children[j].className = "wrong";
		}
	}
	if (input == ANSWER){
		for(let k = 0; k < currently_sellected.childElementCount; k++){
			currently_sellected.children[k].className = "correct";
		}
		$("msg").innerHTML = "Wygrałeś, odpowiedzią było: "+ANSWER;
		won = true;
		$("retry").className = "";
	}
}

function check_all(){
	let can_proceed = true;
	for (let i = 0; i < currently_sellected.childElementCount; i++){
		if (currently_sellected.children[i].innerHTML ==""){
			$("msg").innerHTML = "Wejście nie jest pełne";
			can_proceed = false;
		}
	}
	return can_proceed;
}
ANSWER_ELEMENT.innerHTML = vec[index];
