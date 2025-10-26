//import { URL, KEY } from '../environment.env';
import { supabase } from "../environment.env";

export { fetchTech, fetchAbilitys, fetchVillages, fetchVillageData, fetchMenuData, fetchContentCategories };

async function fetchTech(routeProcessed) {
  console.log(routeProcessed);
  let query = supabase.from("technique_details").select("*");

  // Si hay 1 elemento: buscar por affiliation_abbr
  if (routeProcessed.length === 1) {
    query = query
      .eq("affiliation_abbr", routeProcessed[0]);
      
    }
    // Si hay 2 elementos: buscar por affiliation_abbr y category_name
    else if (routeProcessed.length === 2) {
      query = query
      .eq("affiliation_abbr", routeProcessed[0])
      .eq("category_name", routeProcessed[1]);
  }
  // Si hay 3 elementos: buscar por affiliation_abbr, category_name y subcategory_name
  else if (routeProcessed.length === 4) {    
    
    if(routeProcessed[2] === 'tech' && routeProcessed[3] !== 'generales'){  
      query = query
        .eq("affiliation_abbr", routeProcessed[0])
        .eq("category_name", routeProcessed[1])
        .eq("technique_name", routeProcessed[3]);
    } else if (routeProcessed[2] === 'tech' && routeProcessed[3] === 'generales') {
      if(routeProcessed[1] === 'tecnicas-generales'){
        query = query
          .eq("affiliation_abbr", routeProcessed[0])
          .is("category_name", null)
          .eq("availability_type", "unlimited");
      } else {
        query = query
          .eq("affiliation_abbr", routeProcessed[0])
          .eq("category_name", routeProcessed[1])
          .eq("availability_type", "unlimited");
      }
    } else {
      query = query
        .eq("affiliation_abbr", routeProcessed[0])
        .eq("category_name", routeProcessed[1])
        .eq("subcategory_name", routeProcessed[2]);
    }
  }

  let { data: technique_details, error } = await query;  

  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return technique_details || [];
}

async function fetchAbilitys(routeProcessed){
  //Solo se debe ejecutar si hay más de un elemento, es decir, 2ndo nivel del dropdown
  if(routeProcessed.length < 2) return [];

  let query = supabase.from("entity_profile_abilities_view").select('category_name, description, img_url, stats, ability_names, ability_effects, ability_requirements');

  // Si hay 1 elemento: buscar por affiliation_abbr
  if (routeProcessed.length === 2 || routeProcessed.length === 3 || routeProcessed.length[3] !== null) {
    query = query.eq("category_name", routeProcessed[1]);
  }
  // Si hay 2 elementos: buscar por affiliation_abbr y category_name

  let { data: technique_details, error } = await query;

  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return technique_details || [];
}

async function fetchVillages(){
  let { data: affiliations, error } = await supabase
    .from("affiliations")
    .select("*")
    .eq("is_active", true)
    .order('menu_order', { ascending: true });
  
  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return affiliations || [];
}

async function fetchVillageData(routeProcessed){
  let { data: categories, error } = await supabase
    .from("navigation_complete_view")
    .select("*")
    .eq("affiliation_abbr", routeProcessed)
    .eq("is_active", true)
    .order('category_order', { ascending: true });
  
  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  console.log(categories);
  

  return categories || [];
}

async function fetchMenuData(){
  let { data: categories, error } = await supabase
    .from("navigation_complete_view")
    .select("*")
    .eq("is_active", true);    
  
  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return categories || [];
}

async function fetchContentCategories(routeProcessed){  
  let { data: categories, error } = await supabase
    .from("technique_details")
    .select("*")
    .eq("affiliation_abbr", routeProcessed[0])
    .eq("category_name", routeProcessed[1])
    .or("availability_type.eq.limited, availability_type.eq.exclusive");    
  
  if (error) {
    console.error("Error de conexión:", error);
    return [];
  } 

  return categories || [];
}

