export const WORLDS = {
  hangeul_basic: {
    filter: q => q.category === "consonant"
  },
  
  hangeul_vowel: {
    filter: q => q.category === "vowel"
  },
  
  hangeul_initial: {
    filter: q => q.category === "initial"
  },
  
  assimilation: {
    filter: q => q.category === "assimilation"
  },

  batchim_l1: {
    filter: q => q.category === "batchim" && q.level === 1
  },

  batchim_l2: {
    filter: q => q.category === "batchim" && q.level === 2
  },

  batchim_l3: {
    filter: q => q.category === "batchim" && q.level === 3
  },

  batchim_l4: {
    filter: q => q.category === "batchim" && q.level === 4
  }

};
