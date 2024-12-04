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
let file_conts = await get_file("/data/pl.csv");
let vec = await csvfn(file_conts);
let index = Math.floor(Math.random() * 5500);
// Const's declaration
const ANSWER = vec[index];
const ANSWER_ELEMENT = $("answer");
const ROWS = [$("r1"), $("r2"), $("r3"), $("r4"), $("r5"), $("r6")];
// Start
let won = false;
let can_enter = true;
let currently_sellected;
set_currentlypressed();
let is_keypressed = false;
document.addEventListener("keydown", function(event){
	console.log(event.key);
	if (event.key == "Backspace"){
		handle_keypress(event.key, true)
	}
	else{
		handle_keypress(event.key, false);
	}
});
function set_currentlypressed(){
	let previous_state = currently_sellected;
	for (let i = 0; i < ROWS.length; i++){
		if (ROWS[i].className != "done"){
			currently_sellected = ROWS[i];
			break;
		}
	}
	if (previous_state == currently_sellected){
		if (won == true){
			can_enter = false;
			$("msg").innerHTML = ANSWER;
			$("retry").className = "";
		}
	}
}
function handle_keypress(key, iserase){
	if (iserase){
		for (let i = currently_sellected.childElementCount; i != -1; i--){
			if (currently_sellected.children[i] != undefined&&currently_sellected.children[i].innerHTML != ""){
				currently_sellected.children[i].innerHTML = "";
				break;
			}
		}
	}
	else if (key.length == 1 || key == "Alt"){
		for (let i = 0; i < currently_sellected.childElementCount; i++){
			if (currently_sellected.children[i].innerHTML == "" && key.length==1){
				currently_sellected.children[i].innerHTML = key;
				break;
			}
		}
	}
	else if (key == "Enter"){
		if (check_all()){
			handle_enter();
		}
	}
}

function check_all(){
	let can_proceed = true;
	for (let i = 0; i < currently_sellected.childElementCount; i++){
		if (currently_sellected.children[i].innerHTML ==""){
			$("msg").innerHTML = "Cannot Proceed! Input isn't full";
			can_proceed = false;
		}
	}
	return can_proceed;
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
		$("msg").innerHTML = ANSWER;
		$("retry").className = "";
	}
}
function contains(str, chr){
	for (let i =0; i < str.length; i++){
		if (str[i] == chr){
			return true;
		}
	}
	return false;
}

function handle_enter(){
	currently_sellected.className = "done";
	check_password();
	set_currentlypressed();
}
ANSWER_ELEMENT.innerHTML = vec[index];
