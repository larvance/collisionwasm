use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn check_collision(
    data_a: &[u8], width_a: usize, height_a: usize, offset_x_a: isize, offset_y_a: isize,
    data_b: &[u8], width_b: usize, height_b: usize, offset_x_b: isize, offset_y_b: isize
) -> bool {
    let start_x = offset_x_a.max(offset_x_b);
    let start_y = offset_y_a.max(offset_y_b);
    let end_x = (offset_x_a + width_a as isize).min(offset_x_b + width_b as isize);
    let end_y = (offset_y_a + height_a as isize).min(offset_y_b + height_b as isize);

    if end_x <= start_x || end_y <= start_y {
        return false;
    }

    for y in start_y..end_y {
        for x in start_x..end_x {
            let ax = x - offset_x_a;
            let ay = y - offset_y_a;
            let bx = x - offset_x_b;
            let by = y - offset_y_b;

            let ia = (ay * width_a as isize + ax) * 4 + 3;
            let ib = (by * width_b as isize + bx) * 4 + 3;

            if ia < 0 || ib < 0 { continue; }

            let alpha_a = data_a.get(ia as usize).copied().unwrap_or(0);
            let alpha_b = data_b.get(ib as usize).copied().unwrap_or(0);

            if alpha_a > 0 && alpha_b > 0 {
                return true;
            }
        }
    }

    return false;
}