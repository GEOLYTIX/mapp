export default (function () {

    const xmlSerializer = new XMLSerializer();

    let renderCount = 0

    mapp.layer.themes.sentiment = (theme, feature) => {

        if (feature.properties.features.length > 1) {

            let clusterSentiment = {
                0: 0,
                25: 0,
                50: 0,
                75: 0,
                100: 0
            };

            for (let i = 0; i < feature.properties.features.length - 1; i++) {
                clusterSentiment[parseInt(feature.properties.features[i].getProperties().properties.sentiment)]++;
            }

            Object.keys(clusterSentiment).forEach(key => {

                clusterSentiment[key] = clusterSentiment[key] / (feature.properties.features.length - 1) * 100

            })

            let start = 0;

            let icon = mapp.utils.svg.node`
            <svg width=24 height=24 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <circle cx=12 cy=12 r=12 fill='#555'></circle>`;

            Object.entries(clusterSentiment).map((sentVal) => {
                if (sentVal[1]) {

                    icon.appendChild(mapp.utils.svg.node`
                    <path d=${createSvgArc([12, 12], 12, [start, sentVal[1] - 0.01])} fill=${theme.sentimentColour[sentVal[0]]}/>`);

                    start = start + sentVal[1];
                }
            });

            icon.appendChild(mapp.utils.svg.node`<circle cx=12 cy=12 r=8 fill='#fff'></circle>`);

            let style = {
                icon: {
                    svg: `data:image/svg+xml,${encodeURIComponent(
                        xmlSerializer.serializeToString(icon)
                    )}`,
                    scale: 2
                }
            }

            feature.style = style

            return;
        }

        let icon = mapp.utils.svg.node`
            <svg width=24 height=24 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <circle cx=12 cy=12 r=12 fill='${theme.sentimentColour[parseInt(feature.properties.sentiment)] || "#555"}'></circle>`;

        let style = {
            icon: {
                svg: `data:image/svg+xml,${encodeURIComponent(
                    xmlSerializer.serializeToString(icon)
                )}`,
                scale: 2
            }
        }

        feature.style = style;

        console.log(renderCount++)
    }

    function createSvgArc([cx, cy], r, [start, sweep], φ = -1.5708) {
        let t1 = start * 0.062831853071796;

        let Δ = sweep * 0.062831853071796;

        /*
            cx,cy → center of ellipse
            r → radius
            t1 → start angle, in radian.
            Δ → angle to sweep, in radian. positive.
            φ → rotation on the whole, in radian
            URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
          */

        const cos = Math.cos;
        const sin = Math.sin;
        const π = Math.PI;

        const f_matrix_times = ([[a, b], [c, d]], [x, y]) => [
            a * x + b * y,
            c * x + d * y
        ];
        const f_rotate_matrix = (x) => [
            [cos(x), -sin(x)],
            [sin(x), cos(x)]
        ];
        const f_vec_add = ([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2];

        Δ = Δ % (2 * π);
        const rotMatrix = f_rotate_matrix(φ);
        const [sX, sY] = f_vec_add(
            f_matrix_times(rotMatrix, [r * cos(t1), r * sin(t1)]),
            [cx, cy]
        );
        const [eX, eY] = f_vec_add(
            f_matrix_times(rotMatrix, [r * cos(t1 + Δ), r * sin(t1 + Δ)]),
            [cx, cy]
        );
        const fA = Δ > π ? 1 : 0;
        const fS = Δ > 0 ? 1 : 0;

        return [
            "M",
            cx,
            cy,
            "L",
            sX,
            sY,
            "A",
            r,
            r,
            (φ / (2 * π)) * 360,
            fA,
            fS,
            eX,
            eY,
            "L",
            cx,
            cy
        ].join(" ");
    }

})()
