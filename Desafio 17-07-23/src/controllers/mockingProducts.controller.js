import { Faker, faker, es_MX} from "@faker-js/faker";

const configFaker = new Faker({
    locale:[es_MX]
});
const {commerce, database, image, string, internet, lorem} = configFaker;
//Generando productos 
const generateProduct = () =>{
    return{
        id:database.mongodbObjectId(),
        title: commerce.productName(),
        description:lorem.words(10),
        code:string.alphanumeric(10),
        price:parseInt(string.numeric(4)),
        status:true,
        stock:parseInt(string.numeric(2)),
        category:commerce.department(),
        thumbnails:image.urlPicsumPhotos(),
    }
};
const mockingproductsNumber = 100;
let mockingproductsDatabase = [];
export class mockingController {
    static async productsGenerator(req,res){
        mockingproductsDatabase =[];
        for(let i=0;i<mockingproductsNumber;i++){
            const newProduct = generateProduct();
            mockingproductsDatabase.push(newProduct);
        }
        res.send(mockingproductsDatabase)
    }
}