/* Guide produits : trouver le bon manchon / la bonne brosse / le bon adhésif chez le client.
   Les données ci-dessous sont des informations produit publiques (aucune donnée client ni prix).
   Désignation, UDV et prix sont lus en direct dans le catalogue du CRM à partir des références.

   Structure : famille (Manchons, Brosses, Adhésifs) > catégorie (type de travaux) > filtres + produits.
   Pour ajouter un produit : copier un bloc de "products" dans la bonne catégorie, renseigner les
   références et les critères (identifiants des options de "filters"). "ideal" = cases « xx » du
   tableau : utilisation idéale (badge IDÉAL, le produit remonte en tête). */
(function () {
  const ICONS = {
    manchons: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="9" width="28" height="14" rx="5" fill="currentColor" opacity=".9"/><path d="M34 16h6v10H24v14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="20" y="38" width="8" height="7" rx="2" fill="currentColor"/></svg>',
    brosses: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="20" y="4" width="8" height="16" rx="3" fill="currentColor"/><rect x="15" y="19" width="18" height="7" rx="2" fill="currentColor" opacity=".75"/><path d="M14 26h20l-2 17H16z" fill="currentColor" opacity=".9"/></svg>',
    adhesifs: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="20" cy="22" r="14" fill="none" stroke="currentColor" stroke-width="7"/><path d="M20 36h22v-7" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>',
  };

  const GUIDE = {
    families: [
      {
        id: "manchons",
        label: "Manchons",
        subtitle: "Rouleaux de peinture",
        source: "Tableau « Utilisation des manchons » (01.03.16)",
        // Une catégorie = un type de travaux, avec ses propres critères et ses manchons.
        // criteria : cases « x » du tableau ; ideal : cases « xx » (produit le plus recommandé).
        categories: [
          {
            "id": "facade",
            "label": "Peintures façades",
            "filters": [
              {
                "id": "surface",
                "label": "Surface",
                "options": [
                  {
                    "id": "irregulier",
                    "label": "Irrégulier"
                  },
                  {
                    "id": "fort-relief",
                    "label": "Fort relief"
                  }
                ]
              },
              {
                "id": "primaire",
                "label": "Primaire",
                "options": [
                  {
                    "id": "impression",
                    "label": "Impression"
                  }
                ]
              },
              {
                "id": "peinture",
                "label": "Peinture",
                "options": [
                  {
                    "id": "film-mince",
                    "label": "Film mince",
                    "phase": "eau"
                  },
                  {
                    "id": "semi-epais",
                    "label": "Semi-épais",
                    "phase": "eau"
                  },
                  {
                    "id": "epais",
                    "label": "Épais",
                    "phase": "eau"
                  },
                  {
                    "id": "pliolite",
                    "label": "Pliolite",
                    "phase": "solvant"
                  }
                ]
              },
              {
                "id": "viscosite",
                "label": "Viscosité",
                "options": [
                  {
                    "id": "haute",
                    "label": "Haute"
                  },
                  {
                    "id": "faible",
                    "label": "Faible"
                  }
                ]
              },
              {
                "id": "finition",
                "label": "Finition",
                "options": [
                  {
                    "id": "structure",
                    "label": "Structuré"
                  },
                  {
                    "id": "poche",
                    "label": "Poché"
                  },
                  {
                    "id": "pommele",
                    "label": "Pommelé"
                  }
                ]
              }
            ],
            "products": [
              {
                "name": "Fdg-line · monté sur mousse",
                "refs": [
                  "25203",
                  "25273"
                ],
                "photo": "assets/guide/image7.jpg",
                "criteria": {
                  "surface": [
                    "irregulier",
                    "fort-relief"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Green-line · monté sur mousse",
                "refs": [
                  "25202",
                  "25272"
                ],
                "photo": "assets/guide/image9.jpg",
                "criteria": {
                  "surface": [
                    "irregulier",
                    "fort-relief"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Dickmann",
                "refs": [
                  "25287"
                ],
                "photo": "assets/guide/image10.jpg",
                "criteria": {
                  "surface": [
                    "irregulier",
                    "fort-relief"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Topline",
                "refs": [
                  "26183",
                  "26253"
                ],
                "photo": "assets/guide/image12.jpg",
                "criteria": {
                  "surface": [
                    "irregulier",
                    "fort-relief"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ],
                  "primaire": [
                    "impression"
                  ]
                }
              },
              {
                "name": "Silverline · monté sur mousse",
                "refs": [
                  "25209",
                  "25279"
                ],
                "photo": "assets/guide/image5.jpg",
                "criteria": {
                  "surface": [
                    "irregulier",
                    "fort-relief"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Fdg-line",
                "refs": [
                  "25183",
                  "25253"
                ],
                "photo": "assets/guide/image6.jpg",
                "criteria": {
                  "surface": [
                    "fort-relief"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Green-line",
                "refs": [
                  "25182",
                  "25252"
                ],
                "photo": "assets/guide/image8.jpg",
                "criteria": {
                  "surface": [
                    "fort-relief"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Silverline",
                "refs": [
                  "25189",
                  "25259"
                ],
                "photo": "assets/guide/image4.jpg",
                "criteria": {
                  "surface": [
                    "fort-relief"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Microline 17",
                "refs": [
                  "26181",
                  "26251"
                ],
                "photo": "assets/guide/image13.jpg",
                "criteria": {
                  "surface": [
                    "fort-relief"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais",
                    "pliolite"
                  ],
                  "finition": [
                    "structure",
                    "pommele"
                  ]
                }
              },
              {
                "name": "Polyacryl",
                "refs": [
                  "25219",
                  "25289"
                ],
                "photo": "assets/guide/image2.jpg",
                "criteria": {
                  "surface": [
                    "fort-relief"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "film-mince",
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Mouton",
                "refs": [
                  "25254"
                ],
                "photo": "assets/guide/image3.jpg",
                "criteria": {
                  "surface": [
                    "fort-relief"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "pliolite"
                  ],
                  "finition": [
                    "structure"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "pliolite"
                  ]
                }
              },
              {
                "name": "Vestan",
                "refs": [
                  "25180",
                  "25250"
                ],
                "photo": "assets/guide/image1.jpg",
                "criteria": {
                  "surface": [
                    "fort-relief"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "film-mince",
                    "semi-epais"
                  ],
                  "finition": [
                    "structure"
                  ]
                }
              },
              {
                "name": "Texturé 20mm",
                "refs": [
                  "98202M"
                ],
                "criteria": {
                  "peinture": [
                    "epais"
                  ],
                  "viscosite": [
                    "haute"
                  ],
                  "finition": [
                    "poche"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "epais"
                  ],
                  "viscosite": [
                    "haute"
                  ]
                }
              }
            ]
          },
          {
            "id": "interieur",
            "label": "Peintures intérieures",
            "filters": [
              {
                "id": "surface",
                "label": "Surface",
                "options": [
                  {
                    "id": "toile-verre",
                    "label": "Toile de verre"
                  },
                  {
                    "id": "reguliere",
                    "label": "Régulière"
                  },
                  {
                    "id": "lisse",
                    "label": "Lisse"
                  }
                ]
              },
              {
                "id": "primaire",
                "label": "Primaire",
                "options": [
                  {
                    "id": "impression",
                    "label": "Impression"
                  }
                ]
              },
              {
                "id": "peinture",
                "label": "Peinture",
                "options": [
                  {
                    "id": "mate-eau",
                    "label": "Mate",
                    "phase": "eau"
                  },
                  {
                    "id": "satinee-eau",
                    "label": "Satinée",
                    "phase": "eau"
                  },
                  {
                    "id": "mate-solvant",
                    "label": "Mate",
                    "phase": "solvant"
                  },
                  {
                    "id": "satinee-solvant",
                    "label": "Satinée",
                    "phase": "solvant"
                  }
                ]
              },
              {
                "id": "viscosite",
                "label": "Viscosité",
                "options": [
                  {
                    "id": "haute",
                    "label": "Haute"
                  },
                  {
                    "id": "faible",
                    "label": "Faible"
                  }
                ]
              },
              {
                "id": "finition",
                "label": "Finition",
                "options": [
                  {
                    "id": "poche",
                    "label": "Poché"
                  },
                  {
                    "id": "pommele",
                    "label": "Pommelé"
                  },
                  {
                    "id": "semi-tendu",
                    "label": "Semi-tendu"
                  }
                ]
              }
            ],
            "products": [
              {
                "name": "Goldline",
                "refs": [
                  "25176",
                  "25246"
                ],
                "photo": "assets/guide/image18.jpg",
                "criteria": {
                  "surface": [
                    "toile-verre",
                    "reguliere"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "mate-eau",
                    "satinee-eau",
                    "mate-solvant",
                    "satinee-solvant"
                  ],
                  "finition": [
                    "poche"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "mate-solvant"
                  ]
                }
              },
              {
                "name": "Topline",
                "refs": [
                  "26184",
                  "26254"
                ],
                "photo": "assets/guide/image19.jpg",
                "criteria": {
                  "surface": [
                    "toile-verre",
                    "reguliere"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "mate-eau",
                    "satinee-eau",
                    "mate-solvant",
                    "satinee-solvant"
                  ],
                  "finition": [
                    "poche"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "mate-eau"
                  ]
                }
              },
              {
                "name": "Silverline",
                "refs": [
                  "25189",
                  "25259"
                ],
                "photo": "assets/guide/image20.jpg",
                "criteria": {
                  "surface": [
                    "reguliere"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "mate-eau",
                    "satinee-eau"
                  ],
                  "finition": [
                    "pommele"
                  ]
                }
              },
              {
                "name": "Microfibre 14",
                "refs": [
                  "25198"
                ],
                "photo": "assets/guide/image21.jpg",
                "criteria": {
                  "surface": [
                    "toile-verre",
                    "reguliere"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "mate-eau",
                    "satinee-eau"
                  ],
                  "viscosite": [
                    "faible"
                  ],
                  "finition": [
                    "pommele"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "mate-eau"
                  ]
                }
              },
              {
                "name": "Microfibre 10",
                "refs": [
                  "25188",
                  "25258"
                ],
                "photo": "assets/guide/image21.jpg",
                "criteria": {
                  "surface": [
                    "reguliere"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "satinee-eau"
                  ],
                  "viscosite": [
                    "faible"
                  ],
                  "finition": [
                    "semi-tendu"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "satinee-eau"
                  ]
                }
              },
              {
                "name": "Microline 12",
                "refs": [
                  "26185",
                  "26255"
                ],
                "photo": "assets/guide/image13.jpg",
                "criteria": {
                  "surface": [
                    "reguliere"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "mate-eau",
                    "satinee-eau"
                  ],
                  "viscosite": [
                    "faible"
                  ],
                  "finition": [
                    "pommele"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "mate-eau"
                  ]
                }
              },
              {
                "name": "Paintline 7",
                "refs": [
                  "26186",
                  "26256"
                ],
                "photo": "assets/guide/image22.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "mate-eau"
                  ],
                  "viscosite": [
                    "haute"
                  ],
                  "finition": [
                    "semi-tendu"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "mate-eau"
                  ]
                }
              },
              {
                "name": "Paintline 13",
                "refs": [
                  "25181",
                  "25251"
                ],
                "photo": "assets/guide/image23.jpg",
                "criteria": {
                  "surface": [
                    "reguliere"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "peinture": [
                    "mate-eau",
                    "satinee-eau"
                  ],
                  "viscosite": [
                    "haute"
                  ],
                  "finition": [
                    "pommele"
                  ]
                },
                "ideal": {
                  "peinture": [
                    "mate-eau"
                  ]
                }
              }
            ]
          },
          {
            "id": "laque",
            "label": "Laques & vernis",
            "filters": [
              {
                "id": "surface",
                "label": "Surface",
                "options": [
                  {
                    "id": "regulier",
                    "label": "Régulier"
                  },
                  {
                    "id": "lisse",
                    "label": "Lisse"
                  }
                ]
              },
              {
                "id": "primaire",
                "label": "Primaire",
                "options": [
                  {
                    "id": "impression",
                    "label": "Impression"
                  }
                ]
              },
              {
                "id": "laque",
                "label": "Laque",
                "options": [
                  {
                    "id": "mat-satine-eau",
                    "label": "Mat satiné",
                    "phase": "eau"
                  },
                  {
                    "id": "brillant-eau",
                    "label": "Brillant",
                    "phase": "eau"
                  },
                  {
                    "id": "mat-satine-solvant",
                    "label": "Mat satiné",
                    "phase": "solvant"
                  },
                  {
                    "id": "brillant-solvant",
                    "label": "Brillant",
                    "phase": "solvant"
                  }
                ]
              },
              {
                "id": "bois",
                "label": "Traitement bois",
                "options": [
                  {
                    "id": "microporeux",
                    "label": "Microporeux"
                  },
                  {
                    "id": "lasure",
                    "label": "Lasure"
                  },
                  {
                    "id": "vernis",
                    "label": "Vernis"
                  }
                ]
              },
              {
                "id": "viscosite",
                "label": "Viscosité",
                "options": [
                  {
                    "id": "haute",
                    "label": "Haute"
                  },
                  {
                    "id": "faible",
                    "label": "Faible"
                  }
                ]
              },
              {
                "id": "finition",
                "label": "Finition",
                "options": [
                  {
                    "id": "pommele",
                    "label": "Pommelé"
                  },
                  {
                    "id": "semi-tendu",
                    "label": "Semi-tendu"
                  },
                  {
                    "id": "tendu",
                    "label": "Tendu"
                  }
                ]
              }
            ],
            "products": [
              {
                "name": "Microline 17",
                "refs": [
                  "26181",
                  "26251"
                ],
                "photo": "assets/guide/image13.jpg",
                "criteria": {
                  "surface": [
                    "regulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "bois": [
                    "microporeux",
                    "vernis"
                  ],
                  "viscosite": [
                    "faible"
                  ],
                  "finition": [
                    "semi-tendu"
                  ]
                }
              },
              {
                "name": "Silverline",
                "refs": [
                  "25189",
                  "25259"
                ],
                "photo": "assets/guide/image4.jpg",
                "criteria": {
                  "surface": [
                    "regulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "bois": [
                    "microporeux",
                    "vernis"
                  ],
                  "finition": [
                    "pommele"
                  ]
                }
              },
              {
                "name": "Paintline 7",
                "refs": [
                  "26186",
                  "26256"
                ],
                "photo": "assets/guide/image22.jpg",
                "criteria": {
                  "surface": [
                    "regulier",
                    "lisse"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "laque": [
                    "mat-satine-eau"
                  ],
                  "bois": [
                    "microporeux"
                  ],
                  "viscosite": [
                    "haute"
                  ],
                  "finition": [
                    "tendu"
                  ]
                },
                "ideal": {
                  "laque": [
                    "mat-satine-eau"
                  ]
                }
              },
              {
                "name": "Microfibre 6",
                "refs": [
                  "25178",
                  "21660"
                ],
                "photo": "assets/guide/image21.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "laque": [
                    "mat-satine-eau",
                    "brillant-eau"
                  ],
                  "bois": [
                    "microporeux",
                    "lasure",
                    "vernis"
                  ],
                  "viscosite": [
                    "faible"
                  ],
                  "finition": [
                    "tendu"
                  ]
                },
                "ideal": {
                  "laque": [
                    "brillant-eau"
                  ]
                }
              },
              {
                "name": "Laqueur Velours",
                "refs": [
                  "25185"
                ],
                "photo": "assets/guide/image24.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "laque": [
                    "mat-satine-solvant",
                    "brillant-solvant"
                  ],
                  "bois": [
                    "microporeux",
                    "vernis"
                  ],
                  "finition": [
                    "tendu"
                  ]
                },
                "ideal": {
                  "laque": [
                    "brillant-solvant"
                  ]
                }
              },
              {
                "name": "Laqueur Mohair",
                "refs": [
                  "25195",
                  "25275"
                ],
                "photo": "assets/guide/image25.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "laque": [
                    "mat-satine-solvant",
                    "brillant-solvant"
                  ],
                  "bois": [
                    "microporeux"
                  ],
                  "finition": [
                    "tendu"
                  ]
                },
                "ideal": {
                  "laque": [
                    "brillant-solvant"
                  ]
                }
              },
              {
                "name": "Laqueur Filt",
                "refs": [
                  "25187"
                ],
                "photo": "assets/guide/image26.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "laque": [
                    "mat-satine-eau",
                    "brillant-eau",
                    "mat-satine-solvant",
                    "brillant-solvant"
                  ],
                  "bois": [
                    "vernis"
                  ],
                  "finition": [
                    "tendu"
                  ]
                },
                "ideal": {
                  "laque": [
                    "brillant-eau"
                  ]
                }
              },
              {
                "name": "Mousse Floquée",
                "refs": [
                  "98300M"
                ],
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "laque": [
                    "mat-satine-eau",
                    "brillant-eau"
                  ],
                  "bois": [
                    "vernis"
                  ],
                  "finition": [
                    "tendu"
                  ]
                },
                "ideal": {
                  "laque": [
                    "brillant-eau"
                  ]
                }
              },
              {
                "name": "Mousse HD",
                "refs": [
                  "23182",
                  "23252"
                ],
                "photo": "assets/guide/image28.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "laque": [
                    "mat-satine-eau",
                    "brillant-eau"
                  ],
                  "bois": [
                    "vernis"
                  ],
                  "finition": [
                    "tendu"
                  ]
                },
                "ideal": {
                  "laque": [
                    "brillant-eau"
                  ]
                }
              }
            ]
          },
          {
            "id": "divers",
            "label": "Divers produits",
            "filters": [
              {
                "id": "surface",
                "label": "Surface",
                "options": [
                  {
                    "id": "irregulier",
                    "label": "Irrégulier"
                  },
                  {
                    "id": "regulier",
                    "label": "Régulier"
                  },
                  {
                    "id": "lisse",
                    "label": "Lisse"
                  }
                ]
              },
              {
                "id": "primaire",
                "label": "Primaire",
                "options": [
                  {
                    "id": "impression",
                    "label": "Impression"
                  }
                ]
              },
              {
                "id": "application",
                "label": "Application",
                "options": [
                  {
                    "id": "metaux",
                    "label": "Traitement des métaux"
                  },
                  {
                    "id": "sols",
                    "label": "Sols"
                  },
                  {
                    "id": "vitrificateur",
                    "label": "Vitrificateur"
                  },
                  {
                    "id": "resines",
                    "label": "Résines"
                  },
                  {
                    "id": "anti-fouling",
                    "label": "Anti-fouling (marine)"
                  },
                  {
                    "id": "gelcoat",
                    "label": "Gelcoat (marine)"
                  }
                ]
              },
              {
                "id": "viscosite",
                "label": "Viscosité",
                "options": [
                  {
                    "id": "haute",
                    "label": "Haute"
                  },
                  {
                    "id": "faible",
                    "label": "Faible"
                  }
                ]
              },
              {
                "id": "finition",
                "label": "Finition",
                "options": [
                  {
                    "id": "poche",
                    "label": "Poché"
                  },
                  {
                    "id": "pommele",
                    "label": "Pommelé"
                  },
                  {
                    "id": "semi-tendu",
                    "label": "Semi-tendu"
                  },
                  {
                    "id": "tendu",
                    "label": "Tendu"
                  }
                ]
              }
            ],
            "products": [
              {
                "name": "Topline",
                "refs": [
                  "26183",
                  "26253"
                ],
                "photo": "assets/guide/image12.jpg",
                "criteria": {
                  "surface": [
                    "irregulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "sols"
                  ],
                  "finition": [
                    "poche"
                  ]
                }
              },
              {
                "name": "Texturé 20mm",
                "refs": [
                  "98202M"
                ],
                "criteria": {
                  "surface": [
                    "irregulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "sols",
                    "resines"
                  ],
                  "viscosite": [
                    "haute"
                  ],
                  "finition": [
                    "poche"
                  ]
                }
              },
              {
                "name": "Paintline 13",
                "refs": [
                  "25181",
                  "25251"
                ],
                "photo": "assets/guide/image23.jpg",
                "criteria": {
                  "surface": [
                    "regulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "metaux",
                    "anti-fouling",
                    "gelcoat"
                  ],
                  "finition": [
                    "poche"
                  ]
                }
              },
              {
                "name": "Goldline",
                "refs": [
                  "25176",
                  "25246"
                ],
                "photo": "assets/guide/image18.jpg",
                "criteria": {
                  "surface": [
                    "regulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "metaux",
                    "anti-fouling",
                    "gelcoat"
                  ],
                  "finition": [
                    "poche"
                  ]
                }
              },
              {
                "name": "Topline",
                "refs": [
                  "26184",
                  "26254"
                ],
                "photo": "assets/guide/image12.jpg",
                "criteria": {
                  "surface": [
                    "regulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "metaux",
                    "sols",
                    "resines",
                    "anti-fouling",
                    "gelcoat"
                  ],
                  "finition": [
                    "poche"
                  ]
                }
              },
              {
                "name": "Microline 17",
                "refs": [
                  "26181",
                  "26251"
                ],
                "photo": "assets/guide/image13.jpg",
                "criteria": {
                  "surface": [
                    "regulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "vitrificateur"
                  ],
                  "viscosite": [
                    "faible"
                  ],
                  "finition": [
                    "semi-tendu"
                  ]
                },
                "ideal": {
                  "application": [
                    "vitrificateur"
                  ]
                }
              },
              {
                "name": "Silverline",
                "refs": [
                  "25186",
                  "25256"
                ],
                "photo": "assets/guide/image4.jpg",
                "criteria": {
                  "surface": [
                    "regulier"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "metaux",
                    "anti-fouling"
                  ],
                  "finition": [
                    "pommele"
                  ]
                }
              },
              {
                "name": "Microfibre 10",
                "refs": [
                  "25188",
                  "25258"
                ],
                "photo": "assets/guide/image21.jpg",
                "criteria": {
                  "surface": [
                    "regulier",
                    "lisse"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "metaux",
                    "vitrificateur",
                    "anti-fouling"
                  ],
                  "viscosite": [
                    "faible"
                  ],
                  "finition": [
                    "pommele"
                  ]
                }
              },
              {
                "name": "Paintline 7",
                "refs": [
                  "26186",
                  "26256"
                ],
                "photo": "assets/guide/image22.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "metaux",
                    "sols",
                    "resines",
                    "anti-fouling",
                    "gelcoat"
                  ],
                  "viscosite": [
                    "haute"
                  ],
                  "finition": [
                    "semi-tendu"
                  ]
                },
                "ideal": {
                  "application": [
                    "sols",
                    "gelcoat"
                  ]
                }
              },
              {
                "name": "Microfibre 6",
                "refs": [
                  "25178",
                  "21660"
                ],
                "photo": "assets/guide/image21.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "metaux"
                  ],
                  "viscosite": [
                    "faible"
                  ],
                  "finition": [
                    "tendu"
                  ]
                }
              },
              {
                "name": "Laqueur Velours",
                "refs": [
                  "25185"
                ],
                "photo": "assets/guide/image24.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "application": [
                    "metaux"
                  ],
                  "finition": [
                    "tendu"
                  ]
                }
              },
              {
                "name": "Laqueur Filt",
                "refs": [
                  "25187"
                ],
                "photo": "assets/guide/image26.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "primaire": [
                    "impression"
                  ],
                  "application": [
                    "metaux"
                  ],
                  "finition": [
                    "tendu"
                  ]
                }
              },
              {
                "name": "Mousse HD",
                "refs": [
                  "23182",
                  "23252"
                ],
                "photo": "assets/guide/image28.jpg",
                "criteria": {
                  "surface": [
                    "lisse"
                  ],
                  "finition": [
                    "tendu"
                  ]
                }
              }
            ]
          }
        ],
      },
      { id: "brosses", label: "Brosses", subtitle: "Pinceaux & brosses", categories: [] },
      { id: "adhesifs", label: "Adhésifs", subtitle: "Rubans de masquage", categories: [] },
    ],
  };

  const state = { family: "manchons", category: {}, selected: {} };

  const esc = (value) => (typeof escapeHtml === "function" ? escapeHtml(value) : String(value ?? ""));
  const money = (value) => {
    try { return formatter.format(Number(value) || 0); } catch (error) { return `${value} €`; }
  };
  const lookup = (ref) => {
    try { return typeof findProduct === "function" ? findProduct(ref) : null; } catch (error) { return null; }
  };

  function currentFamily() {
    return GUIDE.families.find((family) => family.id === state.family) || GUIDE.families[0];
  }
  function familyCount(family) {
    return family.categories.reduce((sum, category) => sum + category.products.length, 0);
  }
  function activeCategory(family) {
    return family.categories.find((category) => category.id === state.category[family.id]) || family.categories[0] || null;
  }
  function selectedFor(family, category) {
    const key = `${family.id}:${category?.id || ""}`;
    if (!state.selected[key]) state.selected[key] = {};
    return state.selected[key];
  }
  function hasSelection(selected) {
    return Object.values(selected).some((list) => list.length);
  }
  function optionLabel(category, filterId, optionId) {
    const filter = category.filters.find((item) => item.id === filterId);
    const option = filter?.options.find((item) => item.id === optionId);
    return option ? option.label + (option.phase ? ` (${option.phase})` : "") : optionId;
  }

  function matchingProducts(family, category) {
    if (!category) return [];
    const selected = selectedFor(family, category);
    return category.products
      .map((product, index) => {
        let ok = true;
        let idealHits = 0;
        Object.entries(selected).forEach(([filterId, options]) => {
          if (!options.length) return;
          const values = product.criteria?.[filterId] || [];
          // Toutes les cases cochées d'un même critère doivent être couvertes par le produit.
          if (!options.every((option) => values.includes(option))) ok = false;
          idealHits += options.filter((option) => (product.ideal?.[filterId] || []).includes(option)).length;
        });
        return { product, ok, idealHits, index };
      })
      .filter((item) => item.ok)
      .sort((a, b) => b.idealHits - a.idealHits || a.index - b.index);
  }

  function renderFamilies() {
    return `<div class="guide-families" role="tablist">${GUIDE.families.map((family, index) => `
      <button type="button" role="tab" class="guide-family${family.id === state.family ? " is-active" : ""}" data-guide-family="${esc(family.id)}" aria-selected="${family.id === state.family}">
        <span class="guide-family-icon">${ICONS[family.id] || ""}</span>
        <span class="guide-family-text"><small>0${index + 1}</small><strong>${esc(family.label)}</strong><em>${esc(family.subtitle || "")}</em></span>
        ${familyCount(family) ? "" : '<span class="guide-soon">Bientôt</span>'}
      </button>`).join("")}</div>`;
  }

  function renderCategories(family) {
    const active = activeCategory(family);
    return `<div class="guide-categories">${family.categories.map((category) => `
      <button type="button" class="guide-category${category === active ? " is-active" : ""}" data-guide-category="${esc(category.id)}">${esc(category.label)}<span>${category.products.length}</span></button>`).join("")}</div>`;
  }

  // Options eau / solvant : une ligne par phase pour ne pas confondre « Mate » eau et « Mate » solvant.
  function chipRows(filter) {
    const phases = [...new Set(filter.options.map((option) => option.phase || ""))];
    if (phases.length < 2 || phases.includes("")) return [{ phase: "", options: filter.options }];
    return phases.map((phase) => ({ phase, options: filter.options.filter((option) => option.phase === phase) }));
  }

  function renderFilters(family, category) {
    const selected = selectedFor(family, category);
    const total = Object.values(selected).reduce((sum, list) => sum + list.length, 0);
    const count = matchingProducts(family, category).length;
    return `<aside class="guide-filters">
      <div class="guide-filters-head"><h3>Votre situation</h3>${total ? `<button type="button" class="guide-reset" data-guide-reset>Effacer (${total})</button>` : ""}</div>
      ${category.filters.map((filter) => `
        <div class="guide-filter-group">
          <p>${esc(filter.label)}</p>
          ${chipRows(filter).map((row) => `<div class="guide-chips">${row.phase ? `<span class="guide-phase is-${esc(row.phase)}"><i></i>${row.phase === "eau" ? "Eau" : "Solvant"}</span>` : ""}${row.options.map((option) => {
            const on = (selected[filter.id] || []).includes(option.id);
            return `<button type="button" class="guide-chip${on ? " is-on" : ""}${option.phase ? ` is-${esc(option.phase)}` : ""}" data-guide-filter="${esc(filter.id)}" data-guide-option="${esc(option.id)}" aria-pressed="${on}" title="${esc(option.phase ? `${option.label} - phase ${option.phase === "eau" ? "aqueuse" : "solvant"}` : option.label)}">${esc(option.label)}</button>`;
          }).join("")}</div>`).join("")}
        </div>`).join("")}
      <button type="button" class="guide-see-results" data-guide-see>Voir ${count} résultat${count > 1 ? "s" : ""}</button>
    </aside>`;
  }

  function renderProductCard(family, category, item, rank) {
    const { product, idealHits } = item;
    const refs = (product.refs || []).map((ref) => {
      const catalog = lookup(ref);
      return `<li><b>${esc(ref)}</b><span>${catalog ? esc(catalog.name) : "Référence absente du catalogue"}</span>${catalog ? `<em>${esc(catalog.udv ? `UDV ${catalog.udv} · ` : "")}${money(catalog.price)}</em>` : ""}</li>`;
    }).join("");
    const rows = category.filters
      .filter((filter) => (product.criteria?.[filter.id] || []).length)
      .map((filter) => `<div><dt>${esc(filter.label)}</dt><dd>${(product.criteria[filter.id] || []).map((id) => {
        const label = esc(optionLabel(category, filter.id, id));
        return (product.ideal?.[filter.id] || []).includes(id) ? `<strong class="is-ideal">${label} ★</strong>` : label;
      }).join(", ")}</dd></div>`)
      .join("");
    const best = rank === 0 && hasSelection(selectedFor(family, category));
    const visual = product.photo
      ? `<img src="${esc(product.photo)}" alt="${esc(product.name)}" loading="lazy" />`
      : ICONS[family.id] || "";
    return `<article class="guide-card${best ? " is-best" : ""}">
      <div class="guide-card-visual">${visual}${idealHits ? '<span class="guide-ideal">Idéal</span>' : best ? '<span class="guide-ideal is-soft">Conseillé</span>' : ""}</div>
      <div class="guide-card-body">
        <h4>${esc(product.name)}</h4>
        <ul class="guide-refs">${refs}</ul>
        ${rows ? `<dl class="guide-specs">${rows}</dl>` : ""}
        ${product.note ? `<p class="guide-note">${esc(product.note)}</p>` : ""}
      </div>
    </article>`;
  }

  function renderResults(family, category) {
    const items = matchingProducts(family, category);
    const filtered = hasSelection(selectedFor(family, category));
    const title = `${filtered ? `${items.length} ${family.label.toLowerCase()} adapté${items.length > 1 ? "s" : ""}` : `Tous les ${family.label.toLowerCase()}`} · ${category.label.toLowerCase()}`;
    return `<section class="guide-results">
      <h3>${esc(title)}</h3>
      ${items.length
        ? `<div class="guide-grid">${items.map((item, index) => renderProductCard(family, category, item, index)).join("")}</div>`
        : `<div class="guide-empty">Aucun ${family.label.toLowerCase().replace(/s$/, "")} ne coche tous ces critères. Retirez un critère pour élargir la recherche.</div>`}
      ${family.source ? `<p class="guide-source">Source : ${esc(family.source)} · ★ = utilisation idéale</p>` : ""}
    </section>`;
  }

  function render() {
    const root = document.querySelector("#guideRoot");
    if (!root) return;
    const family = currentFamily();
    const category = activeCategory(family);
    const body = familyCount(family) && category
      ? `${renderCategories(family)}<div class="guide-layout">${renderFilters(family, category)}${renderResults(family, category)}</div>`
      : `<div class="guide-coming"><span>${ICONS[family.id] || ""}</span><h3>${esc(family.label)} : bientôt disponible</h3><p>Le sélecteur ${esc(family.label.toLowerCase())} sera ajouté dès que le tableau des critères sera prêt.</p></div>`;
    root.innerHTML = `${renderFamilies()}${body}`;
  }

  document.addEventListener("click", (event) => {
    const root = document.querySelector("#guideRoot");
    if (!root || !root.contains(event.target)) return;
    const familyButton = event.target.closest("[data-guide-family]");
    const categoryButton = event.target.closest("[data-guide-category]");
    const chip = event.target.closest("[data-guide-option]");
    const family = currentFamily();
    const category = activeCategory(family);
    if (familyButton) {
      state.family = familyButton.dataset.guideFamily;
    } else if (categoryButton) {
      state.category[family.id] = categoryButton.dataset.guideCategory;
    } else if (chip) {
      const selected = selectedFor(family, category);
      const list = selected[chip.dataset.guideFilter] || (selected[chip.dataset.guideFilter] = []);
      const index = list.indexOf(chip.dataset.guideOption);
      if (index >= 0) list.splice(index, 1); else list.push(chip.dataset.guideOption);
    } else if (event.target.closest("[data-guide-see]")) {
      root.querySelector(".guide-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    } else if (event.target.closest("[data-guide-reset]")) {
      state.selected[`${family.id}:${category?.id || ""}`] = {};
    } else {
      return;
    }
    render();
  });

  window.PRODUCT_GUIDE = GUIDE;
  window.renderProductGuide = render;
})();
