//import { URL, KEY } from '../environment.env';
import { supabase } from "../environment.env";

export {
  fetchTech,
  fetchAbilitys,
  fetchVillages,
  fetchVillageData,
  fetchMenuData,
  fetchContentCategories,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  updateAffiliationStatus,
  fetchCategories,
  updateCategoryStatus,
  fetchSubcategories,
  updateSubcategoryStatus,
  fetchAffiliationById,
  updateAffiliation,
  fetchCategoryById,
  updateCategory,
  fetchSubcategoryById,
  updateSubcategory,
  uploadImageToStorage
};

async function fetchTech(routeProcessed) {
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

async function fetchVillages(includeInactive = false){
  let query = supabase
    .from("affiliations")
    .select("*");

  // Solo filtra por is_active si no queremos incluir inactivos
  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  let { data: affiliations, error } = await query.order('menu_order', { ascending: true });

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
    .in("availability_type", ["limited", "exclusive"]);

  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return categories || [];
}

// Funciones de Autenticación 

async function signUp(email, password, username) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error en registro:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error en login:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return { success: false, error: error.message };
  }
}

async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    // Si no hay sesión activa retornar null
    if (error?.message === 'Auth session missing!') {
      return null;
    }

    if (error) throw error;

    if (user) {
      // Obtener el perfil del usuario y rol
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error al obtener perfil:", profileError);
        return user;
      }

      // Añadir el rol al objeto user
      user.role = profile?.role || null;
    }

    return user;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}

async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    return session;
  } catch (error) {
    console.error("Error al obtener sesión:", error);
    return null;
  }
}

// Funciones de Gestión de Contenido

async function updateAffiliationStatus(affiliationId, isActive) {
  try {
    const { data, error } = await supabase
      .from('affiliations')
      .update({ is_active: isActive })
      .eq('affiliation_id', affiliationId)
      .select();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al actualizar estado de afiliación:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function fetchCategories(includeInactive = false) {
  let query = supabase
    .from("categories")
    .select("category_id, category_name, menu_order, is_active");

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  let { data: categories, error } = await query
    .order('menu_order', { ascending: true });

  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return categories || [];
}

async function updateCategoryStatus(categoryId, isActive) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ is_active: isActive })
      .eq('category_id', categoryId)
      .select();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al actualizar estado de categoría:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function fetchSubcategories(includeInactive = false) {
  let query = supabase
    .from("subcategories")
    .select(`
      subcategory_id,
      subcategory_name,
      menu_order,
      is_active,
      category:categories(category_name)
    `);

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  let { data: subcategories, error } = await query
    .order('menu_order', { ascending: true });

  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  // Transformar los datos para que category_name esté al mismo nivel
  const transformedSubcategories = subcategories?.map(subcat => ({
    subcategory_id: subcat.subcategory_id,
    subcategory_name: subcat.subcategory_name,
    menu_order: subcat.menu_order,
    is_active: subcat.is_active,
    category_name: subcat.category?.category_name || 'Sin categoría'
  }));

  return transformedSubcategories || [];
}

async function updateSubcategoryStatus(subcategoryId, isActive) {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .update({ is_active: isActive })
      .eq('subcategory_id', subcategoryId)
      .select();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al actualizar estado de subcategoría:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function fetchAffiliationById(affiliationId) {
  try {
    const { data, error } = await supabase
      .from('affiliations')
      .select('*')
      .eq('affiliation_id', affiliationId)
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al obtener afiliación:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function updateAffiliation(affiliationId, updates) {
  try {
    const { data, error } = await supabase
      .from('affiliations')
      .update(updates)
      .eq('affiliation_id', affiliationId)
      .select();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al actualizar afiliación:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function fetchCategoryById(categoryId) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_id', categoryId)
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function updateCategory(categoryId, updates) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('category_id', categoryId)
      .select();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function fetchSubcategoryById(subcategoryId) {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select(`
        *,
        category:categories(category_id, category_name)
      `)
      .eq('subcategory_id', subcategoryId)
      .single();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al obtener subcategoría:", error);
    return { success: false, data: null, error: error.message };
  }
}

async function updateSubcategory(subcategoryId, updates) {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .update(updates)
      .eq('subcategory_id', subcategoryId)
      .select();

    if (error) throw error;

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error al actualizar subcategoría:", error);
    return { success: false, data: null, error: error.message };
  }
}

// Imágenes

async function convertToWebP(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Error al convertir imagen a WebP'));
          }
        }, 'image/webp', 0.85);
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
}

async function uploadImageToStorage(file, bucketName, folder = '', customFileName = null) {
  try {
    // Convertir imagen a WebP
    const webpBlob = await convertToWebP(file);

    // Generar nombre del archivo
    let fileName;
    if (customFileName) {
      fileName = `${customFileName}.webp`;
    } else {
      const timestamp = Date.now();
      fileName = `${timestamp}.webp`;
    }

    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, webpBlob, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Obtener URL firmada de 2 años de duración
    const { data: signedUrlData, error: signedError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 63072000);

    if (signedError) throw signedError;

    return { success: true, url: signedUrlData.signedUrl, error: null };
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return { success: false, url: null, error: error.message };
  }
}
