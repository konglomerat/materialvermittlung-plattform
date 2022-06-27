SELECT
       material_id,
       material.title as material_title,
       material.description as material_description,
       material.quantity_unit as material_unit,
       material.dimensions as material_dimensions,
       material.color as material_color,
       material.created_at as material_created_at,
       material.updated_at as material_updated_at,
       material.is_finished as material_is_finished,
       material.is_draft as material_is_draft,
       material.disallow_partial_reservations as material_disallow_partial_reservations,
       flow.flow_type as flow_type,
       flow.quantity as flow_quantity,
       flow.created_on as flow_created_on,
       flow.reservation_approved_at as flow_reservation_approved_at,
       flow.picked_up_at as flow_picked_up_at,
       flow.comment as flow_comment
FROM material
         LEFT JOIN
(
    SELECT
        'outflow' as flow_type,
        id as flow_id,
        material_id,
        outflow.quantity as quantity,
        comment,
        created_on,
        picked_up_at,
        reservation_approved_at
    FROM outflow
    UNION
    SELECT
        'inflow' as flow_type,
        id as flow_id,
        material_id,
        inflow.quantity as quantity,
        comment,
        created_on,
        null as picked_up_at,
        null as reservation_approved_at
    FROM inflow
) as flow ON material_id = material.id
ORDER BY material_id, flow_type
LIMIT 10000
