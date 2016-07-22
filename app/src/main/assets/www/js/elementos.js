function Category(it, pindex) {
     this.name = it.name;
     this.icon = "categorias/" + it.name + "/" + it.name + ".png";
     this.sound = "categorias/" + it.name + "/" + it.name + ".mp3";
     this.color = it.color;
     this.type = "category";
     this.index = pindex;
 }

function SubCategory(cat, subcat, pindex) {
     this.name = subcat.name;
     this.icon = "categorias/" + cat.name + "/" +  subcat.name + "/" + subcat.name + ".png";
     this.sound = "categorias/" + cat.name + "/" +  subcat.name + "/" + subcat.name + ".mp3";
     this.color = cat.color;
     this.category = cat;
     this.type = "subcategory";
     this.index = pindex;
 }
 
 function Element(name, cat, subcat) {
    this.name = name;
    this.type = "element";
    this.cat = cat;
    this.subcat = subcat;
    if (subcat !== undefined) {
       this.icon = "categorias/" + cat.name + "/" +  subcat.name + "/elementos/" + name + ".png";
       this.sound = "categorias/" + cat.name +  "/" +  subcat.name + "/elementos/" + name + ".mp3";
       this.color = cat.color;
    }else if (cat !== undefined){
       this.icon = "categorias/" + cat.name + "/elementos/" + name + ".png";
       this.sound = "categorias/" + cat.name + "/elementos/" + name + ".mp3";
       this.color = cat.color;
    }
 }

