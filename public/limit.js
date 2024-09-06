//移動作制限関数　以下長いので制限に関するものだけ記す
export class Check { 
    checkmoving(row, col, text, id) {
    if (id == 'player0') {
        if (text == '歩') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
                }
            }
        }
        if (text == '香') {
           for(let i=0; i<row; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
            if(cell.id == 'player0') {
                break;
            } else if(cell.id == 'player1') {
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            cell.classList.add('possible');
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            cell.classList.add('possible');
           }
        }
        if (text == '桂') {
            if(cell = document.querySelector(`[data-row="${row-2}"][data-col="${col+1}"]`)) {
            checkboardRow[0] = row-2;
            checkboardCol[0] = col+1;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row-2}"][data-col="${col-1}"]`)) {
                checkboardRow[1] = row-2;
                checkboardCol[1] = col-1;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
    }
        if (text == '銀') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
                }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row+1;
                checkboardCol[3] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row+1;
                checkboardCol[4] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
    }
        if (text == '金' || text == 'と') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
                }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row;
                checkboardCol[3] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row;
                checkboardCol[4] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
                checkboardRow[5] = row+1;
                checkboardCol[5] = col;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }  
    }
        if (text == '王') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
                }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row;
                checkboardCol[3] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row;
                checkboardCol[4] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
                checkboardRow[5] = row+1;
                checkboardCol[5] = col;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
                checkboardRow[6] = row+1;
                checkboardCol[6] = col-1;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
                checkboardRow[7] = row+1;
                checkboardCol[7] = col+1;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
    }
        if (text == '飛') {
            let j = 0;
            //上方向
            for(let i=0; i<row; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col;
                cell.classList.add('possible');
                j++;
            }
            //下方向
            for(let i=0; i<8-row; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col;
                cell.classList.add('possible');
                j++;
            }
            //右方向
            for(let i=0; i<8-col; i++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row;
                checkboardCol[0+i+j] = col+i+1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row;
                checkboardCol[0+i+j] = col+i+1;
                cell.classList.add('possible');
                j++;
        }
            //左方向
            for(let i=0; i<col; i++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
            }
        }   
    if (text == '角') {
        let j = 0;
            //右上方向
            for(let i =0; i < row && i < 8-col; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col+i+1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col+i+1;
                cell.classList.add('possible');
                j++;
            }
            //左上方向
            for(let i=0; i < row && i < col; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row-i-1;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row-i-1;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
            }
            //右下方向
            for(let i=0; i<8-row && i<8-col; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col+i+1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col+i+1;
                cell.classList.add('possible');
                j++;
             }
            //左下方向
            for(let i=0; i<8-row && i<col; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
            }
        }
    }
}
}