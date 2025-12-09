import "../../css/card.scss";

class TechniquePageComponent extends HTMLElement {
  constructor() {
    super();
    this.dataTech = [];
    this.dataAbility = null;
  }

  setData(dataTech, dataAbility) {
    this.dataTech = dataTech;
    this.dataAbility = dataAbility;
    this.render();
  }

  render() {
    const wrapper = this.createCardWrapper();

    if (!Array.isArray(this.dataTech)) {
      this.innerHTML = '';
      this.appendChild(wrapper);
      return;
    }

    if (this.dataAbility !== null) {
      const abilityCards = this.createAbilityCards(this.dataAbility);
      wrapper.appendChild(abilityCards);
    }

    const techCards = this.createTechCards(this.dataTech);
    wrapper.appendChild(techCards);

    this.innerHTML = '';
    this.appendChild(wrapper);
  }

  createCardWrapper() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper-card");
    return wrapper;
  }

  createAbilityCards(dataAbility) {
    const fragment = document.createDocumentFragment();

    Object.values(dataAbility).forEach(ability => {
      const abilityCard = this.createAbilityCard(ability);
      fragment.appendChild(abilityCard);
    });

    return fragment;
  }

  createAbilityCard(ability) {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("div");
    title.classList.add("title-ability");
    title.textContent = ability.category_name;

    const abilityEffect = document.createElement("div");
    abilityEffect.classList.add("ability-effect");

    const abilityImage = document.createElement("div");
    abilityImage.classList.add("ability-image");
    abilityImage.style.backgroundImage = `url('${ability.image_url || ''}')`;

    const description = document.createElement("div");
    description.classList.add("effect");
    description.textContent = ability.description || '';

    const stats = document.createElement("div");
    stats.classList.add("effect");
    stats.textContent = ability.stats || '';

    abilityEffect.appendChild(abilityImage);
    abilityEffect.appendChild(description);
    abilityEffect.appendChild(stats);

    if (Array.isArray(ability.ability_names) && ability.ability_names.length > 0) {
      const characteristics = this.createCharacteristicsSection(ability);
      abilityEffect.appendChild(characteristics);
    }

    card.appendChild(title);
    card.appendChild(abilityEffect);

    return card;
  }

  createCharacteristicsSection(ability) {
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

  createTechCards(dataTech) {
    const fragment = document.createDocumentFragment();

    Object.values(dataTech).forEach(tech => {
      const techCard = this.createTechCard(tech);
      fragment.appendChild(techCard);
    });

    return fragment;
  }

  createTechCard(tech) {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = `${tech.technique_name} - ${tech.japanese_name}`;

    const techType = document.createElement("div");
    techType.classList.add("tech-type");
    techType.textContent = tech.type_name;

    const techInfo = this.createTechInfo(tech);
    const techEffect = this.createTechEffect(tech);

    card.appendChild(title);
    card.appendChild(techType);
    card.appendChild(techInfo);
    card.appendChild(techEffect);

    return card;
  }

  createTechInfo(tech) {
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

  createTechEffect(tech) {
    const techEffect = document.createElement("div");
    techEffect.classList.add("tech-effect");

    const techImage = document.createElement("div");
    techImage.classList.add("tech-image");
    techImage.style.backgroundImage = `url('${tech.image_url}')`;

    const description = document.createElement("div");
    description.classList.add("effect");
    description.textContent = tech.description;

    techEffect.appendChild(techImage);
    techEffect.appendChild(description);

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
}

export default TechniquePageComponent;