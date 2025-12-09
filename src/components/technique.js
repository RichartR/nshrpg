export { renderPage };
import "../css/card.scss";

function renderPage(dataTech, dataAbility) {  
    const wrapper = createCardWrapper();
    
    if (!Array.isArray(dataTech)) return wrapper;

    
    if(dataAbility !== null){
      const abilityCards = createAbilityCards(dataAbility);
      wrapper.appendChild(abilityCards);
    }
    
    const techCards = createTechCards(dataTech);
    wrapper.appendChild(techCards);
    
    return wrapper;
}

function createCardWrapper() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper-card");
    return wrapper;
}

function createAbilityCards(dataAbility) {
    const fragment = document.createDocumentFragment();
    
    Object.values(dataAbility).forEach(ability => {
        const abilityCard = createAbilityCard(ability);
        fragment.appendChild(abilityCard);
    });
    
    return fragment;
}

function createAbilityCard(ability) {
    const card = document.createElement("div");
    card.classList.add("card");
    
    const title = document.createElement("div");
    title.classList.add("title-ability");
    title.textContent = ability.category_name;
    
    const abilityEffect = document.createElement("div");
    abilityEffect.classList.add("ability-effect");
    
    // Imagen de la habilidad
    const abilityImage = document.createElement("div");
    abilityImage.classList.add("ability-image");
    abilityImage.style.backgroundImage = `url('${ability.image_url || ''}')`;
    
    // Descripción
    const description = document.createElement("div");
    description.classList.add("effect");
    description.textContent = ability.description || '';
    
    // Stats
    const stats = document.createElement("div");
    stats.classList.add("effect");
    stats.textContent = ability.stats || '';
    
    abilityEffect.appendChild(abilityImage);
    abilityEffect.appendChild(description);
    abilityEffect.appendChild(stats);
    
    // Características si existen
    if (Array.isArray(ability.ability_names) && ability.ability_names.length > 0) {
        const characteristics = createCharacteristicsSection(ability);
        abilityEffect.appendChild(characteristics);
    }
    
    card.appendChild(title);
    card.appendChild(abilityEffect);
    
    return card;
}

function createCharacteristicsSection(ability) {
    const characteristics = document.createElement("div");
    characteristics.classList.add("effect");
    
    const title = document.createElement("b");
    const span = document.createElement("span");
    span.classList.add("destacado");
    span.textContent = "Características:";
    title.appendChild(span);
    
    characteristics.appendChild(title);
    characteristics.appendChild(document.createElement("br"));
    
    ability.ability_names.forEach((abilityName, index) => {
        const characteristic = document.createElement("div");
        characteristic.textContent = `- ${abilityName}: ${ability.ability_effects?.[index] || ''}`;
        characteristics.appendChild(characteristic);
    });
    
    return characteristics;
}

function createTechCards(dataTech) {
    const fragment = document.createDocumentFragment();
    
    Object.values(dataTech).forEach(tech => {
        const techCard = createTechCard(tech);
        fragment.appendChild(techCard);
    });
    
    return fragment;
}

function createTechCard(tech) {
    const card = document.createElement("div");
    card.classList.add("card");
    
    // Título
    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = `${tech.technique_name} - ${tech.japanese_name}`;
    
    // Tipo de técnica
    const techType = document.createElement("div");
    techType.classList.add("tech-type");
    techType.textContent = tech.type_name;
    
    // Información de la técnica
    const techInfo = createTechInfo(tech);
    
    // Efecto de la técnica
    const techEffect = createTechEffect(tech);
    
    card.appendChild(title);
    card.appendChild(techType);
    card.appendChild(techInfo);
    card.appendChild(techEffect);
    
    return card;
}

function createTechInfo(tech) {
    const techInfo = document.createElement("div");
    techInfo.classList.add("tech-info");
    
    const infoFields = [
        tech.rank_name,
        tech.jutsu_classifications,
        tech.style,
        tech.range_description,
        tech.chakra_cost,
        `Requisitos: ${tech.requirements}`
    ];
    
    infoFields.forEach(field => {
        if (field) {
            const info = document.createElement("div");
            info.classList.add("info");
            info.textContent = field;
            techInfo.appendChild(info);
        }
    });
    
    return techInfo;
}

function createTechEffect(tech) {
    const techEffect = document.createElement("div");
    techEffect.classList.add("tech-effect");
    
    // Imagen de la técnica
    const techImage = document.createElement("div");
    techImage.classList.add("tech-image");
    techImage.style.backgroundImage = `url('${tech.image_url}')`;
    
    // Descripción
    const description = document.createElement("div");
    description.classList.add("effect");
    description.textContent = tech.description;
    
    techEffect.appendChild(techImage);
    techEffect.appendChild(description);
    
    // Efecto
    if (tech.effects) {
        const effect = document.createElement("div");
        effect.classList.add("effect");
        
        const bold = document.createElement("b");
        const span = document.createElement("span");
        span.classList.add("destacado");
        span.textContent = "Efecto: ";
        
        bold.appendChild(span);
        effect.appendChild(bold);
        effect.appendChild(document.createTextNode(tech.effects));
        
        techEffect.appendChild(effect);
    }
    
    // Aclaraciones
    if (tech.clarifications) {
        const clarifications = document.createElement("div");
        clarifications.classList.add("effect");
        
        const bold = document.createElement("b");
        const span = document.createElement("span");
        span.classList.add("destacado");
        span.textContent = "Aclaraciones:";
        
        bold.appendChild(span);
        clarifications.appendChild(bold);
        clarifications.appendChild(document.createElement("br"));
        clarifications.appendChild(document.createTextNode(tech.clarifications));
        
        techEffect.appendChild(clarifications);
    }
    
    return techEffect;
}