import xlsx from 'xlsx';
import { searchGoogleMaps } from './webScrapperServices.js';

const file = xlsx.readFile('Cereal_Products.xlsx')
const data = file.Sheets['Sheet1']

const temp = xlsx.utils.sheet_to_json(data);

const resultData = [];
var comapniesInCoimbatore = temp.filter(temp => temp['District'] === 'Coimbatore');

var success = 0;
console.log("started process at " + new Date());

for (let i = 0; i < comapniesInCoimbatore.length; i++) {
    try {
        let data = comapniesInCoimbatore[i]

        if (!(i % 10) && i != 0) {
            console.log("successfully Sent request for " + success);
        }

        var googleMapsResult = await searchGoogleMaps(`${data['Company']} ${data['District']}`)

        if (!googleMapsResult.length) {
            data["Address"] = googleMapsResult.address
        } else {
            data["Address"] = googleMapsResult.join(" || ");
            data["Address Check"] = "Yes";
        }

        resultData.push(data);
        success += 1;
    }
    catch (err) {
        console.log(err.message + " " + comapniesInCoimbatore[i]['Company'] + " " + i);
        continue;
    }
}

const workbook = xlsx.utils.book_new();

// Convert the array of objects to a worksheet
const worksheet = xlsx.utils.json_to_sheet(resultData);

// Append the worksheet to the workbook
xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// Write the workbook to a file
xlsx.writeFile(workbook, 'Cereal_Products_with_address_1.xlsx');

console.log(`Completed creating excel workbook for ${success} companies - ${new Date()}`)