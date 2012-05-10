mkdir cards_png
cd cards_png
for i in ../cards/*
do
  convert -geometry 100x140 $i `basename $i .svg`.png
done
convert AC.png 2C.png 3C.png 4C.png 5C.png 6C.png 7C.png 8C.png 9C.png TC.png JC.png QC.png KC.png +append clubs.png
convert AD.png 2D.png 3D.png 4D.png 5D.png 6D.png 7D.png 8D.png 9D.png TD.png JD.png QD.png KD.png +append diamonds.png
convert AH.png 2H.png 3H.png 4H.png 5H.png 6H.png 7H.png 8H.png 9H.png TH.png JH.png QH.png KH.png +append hearts.png
convert AS.png 2S.png 3S.png 4S.png 5S.png 6S.png 7S.png 8S.png 9S.png TS.png JS.png QS.png KS.png +append spades.png
convert blank.png back_blue.png back_red.png +append other.png
convert other.png clubs.png diamonds.png hearts.png spades.png -background none -append ../cards.png
cd ..
rm -rf cards_png
