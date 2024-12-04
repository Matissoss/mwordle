use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn csv(val:&str)->Vec<String>{
    let mut finval = val.to_string();
    let mut words : Vec<String> = vec![];
    let mut temp_buf : Vec<char> = vec![];
    if val[val.len()-1..val.len()] != *","{
        finval.push(',');
    }
    for c in finval.chars().collect::<Vec<char>>(){
        if c != ','{
            temp_buf.push(c);
            continue;
        }
        else{
            words.push(String::from_iter(temp_buf.iter()).trim().to_string());
            temp_buf = vec![];
            continue;
        }
    }
    return words;
}
